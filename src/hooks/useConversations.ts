import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  property_id: string;
  user_id: string;
  selected_dates: string;
  created_at: string;
  property_title?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  last_message?: string;
  unread_count?: number;
}

export const useConversations = (userId?: string, isAdmin?: boolean) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["conversations", userId, isAdmin],
    enabled: !!userId,
    queryFn: async (): Promise<Conversation[]> => {
      const { data: convos, error } = await supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const propertyIds = [...new Set((convos || []).map((c: any) => c.property_id))];
      const userIds = [...new Set((convos || []).map((c: any) => c.user_id))];

      const { data: properties } = await supabase
        .from("properties")
        .select("id, title")
        .in("id", propertyIds.length ? propertyIds : ["none"]);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone")
        .in("id", userIds.length ? userIds : ["none"]);

      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .in("conversation_id", (convos || []).map((c: any) => c.id));

      return (convos || []).map((c: any) => {
        const prop = (properties || []).find((p: any) => p.id === c.property_id);
        const profile = (profiles || []).find((p: any) => p.id === c.user_id);
        const convoMsgs = (messages || []).filter((m: any) => m.conversation_id === c.id);
        const lastMsg = convoMsgs.sort((a: any, b: any) => b.created_at.localeCompare(a.created_at))[0];
        const unread = convoMsgs.filter((m: any) => !m.read && m.sender_id !== userId).length;

        return {
          ...c,
          property_title: prop?.title || "Nepoznato",
          user_name: profile?.full_name || "Korisnik",
          user_email: profile?.email || "",
          user_phone: profile?.phone || "",
          last_message: lastMsg?.content || "",
          unread_count: unread,
        };
      });
    },
  });

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
        queryClient.invalidateQueries({ queryKey: ["messages"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, queryClient]);

  return query;
};

export const useMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId,
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data || []) as Message[];
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, senderId, content }: { conversationId: string; senderId: string; content: string }) => {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, userId, selectedDates, initialMessage }: {
      propertyId: string; userId: string; selectedDates: string; initialMessage: string;
    }) => {
      // Upsert conversation
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("property_id", propertyId)
        .eq("user_id", userId)
        .maybeSingle();

      let convoId: string;

      if (existing) {
        convoId = existing.id;
        // Update dates
        await supabase.from("conversations").update({ selected_dates: selectedDates }).eq("id", convoId);
      } else {
        const { data, error } = await supabase
          .from("conversations")
          .insert({ property_id: propertyId, user_id: userId, selected_dates: selectedDates })
          .select("id")
          .single();
        if (error) throw error;
        convoId = data.id;
      }

      // Send the initial message
      const { error: msgError } = await supabase.from("messages").insert({
        conversation_id: convoId,
        sender_id: userId,
        content: initialMessage,
      });
      if (msgError) throw msgError;

      return convoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
