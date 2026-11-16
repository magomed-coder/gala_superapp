import { getSupabaseClient } from "@/shared/api/supabase/supabase";

/** Создаёт один заказ; requestId сохраняется клиентом при повторе, цену и покупателя определяет база. */
export async function placeOrder(input: {
  listingId: string;
  quantity: number;
  requestId: string;
  addressId?: string;
  note?: string;
}) {
  const { data, error } = await getSupabaseClient().rpc("place_order", {
    p_listing_id: input.listingId,
    p_quantity: input.quantity,
    p_request_id: input.requestId,
    p_address_id: input.addressId,
    p_note: input.note ?? "",
  });
  if (error) throw error;
  return data;
}

/** Меняет статус через серверную проверку участника и допустимого перехода; не отмечает оплату. */
export async function changeOrderStatus(
  orderId: string,
  status: "confirmed" | "in_progress" | "completed" | "cancelled",
) {
  const { error } = await getSupabaseClient().rpc("change_order_status", {
    p_order_id: orderId,
    p_status: status,
  });
  if (error) throw error;
}
