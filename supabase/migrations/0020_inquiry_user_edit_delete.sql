-- 답변 전 문의 본인 수정 허용
drop policy if exists "inquiries_update" on public.inquiries;
create policy "inquiries_update" on public.inquiries for update
  using (public.is_admin() or (auth.uid() = user_id and admin_reply is null));

-- 답변 전 문의 본인 삭제 허용
drop policy if exists "inquiries_delete" on public.inquiries;
create policy "inquiries_delete" on public.inquiries for delete
  using (public.is_admin() or (auth.uid() = user_id and admin_reply is null));
