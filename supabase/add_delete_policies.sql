-- Add DELETE policies for orders and edit_history
-- Only admins can delete orders

CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete edit history
CREATE POLICY "Admins can delete edit history" ON public.edit_history
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
