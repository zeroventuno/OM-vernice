-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Models reference table
CREATE TABLE public.models (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial models
-- Insert initial models
INSERT INTO public.models (name) VALUES
  ('GRANFONDO'),
  ('BISALTA'),
  ('SL'),
  ('LEMMA RT'),
  ('SANTIAGO'),
  ('BRONDELLO DISC'),
  ('SL NEW DISC'),
  ('SL COMP 3K'),
  ('LEMMA 3.0'),
  ('SANTIAGO RT'),
  ('OM1'),
  ('OM1 RT');

-- Agents reference table
CREATE TABLE public.agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial agents
-- Insert initial agents
INSERT INTO public.agents (name) VALUES
  ('MICHELE'),
  ('GABRIEL'),
  ('SAMUELE'),
  ('GIOVANNI'),
  ('RICARDO'),
  ('CRISTIANO');

-- Colors reference table
CREATE TABLE public.colors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  hex_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial colors
-- Insert initial colors
INSERT INTO public.colors (name, hex_code) VALUES
  ('BSB62000 - BIANCO', '#EDEDED'),
  ('N9480 - NERO', '#353535'),
  ('R3069 - ROSSO SEGNALE-RT', '#C03131'),
  ('Y1487 - ARANCIONE', '#F09023'),
  ('R3326 - MARRONE', '#6A5844'),
  ('Y1217 - OCRA', '#F7B82B'),
  ('N9199 - SABBIA', '#ABA799'),
  ('N9375 - GRIGIO SCURO', '#82817D'),
  ('Y1307 - GIALLO', '#FDEA3F'),
  ('445D1 - VERDE SALVIA', '#868F5F'),
  ('G6341 - VERDE SALVIA SCURO', '#728258'),
  ('N9429 - GRIGIO CANNA DI FUCILE', '#616261'),
  ('G6502 - VERDE CHIARO', '#30AE50'),
  ('G6074 - G6074', '#297C5B'),
  ('G6284 - VERDE SCURO', '#255D4E'),
  ('G6020 - VERDE ACQUA', '#67B09E'),
  ('N9181 - GRIGIO CHIARO', '#C6C7C7'),
  ('B5509 - OTTANIO', '#187B84'),
  ('B5521 - PETROLIO', '#185660'),
  ('B5123 - BLU OCEANO CHIARO', '#2780DF'),
  ('B5002 - CELESTE', '#A2C8FC'),
  ('B5258 - BLU SCURO', '#323E57'),
  ('B5182 - BLU ZAFFIRO', '#272993'),
  ('R3485 - DIGITAL LAVANDA', '#8879A5'),
  ('R3472 - VIOLA', '#56265C'),
  ('R3442 - FUCSIA', '#B24F6D'),
  ('R3384 - ROSA', '#D1ADB5'),
  ('R3243 - ROSSO RUBINO', '#912238'),
  ('R3279X - CHERRY', '#6E222F'),
  ('29892 - SILVER', '#989695'),
  ('ES9215 - GRIGIO CHIARO', '#C7C6C5'),
  ('EG4110 - RAME', '#B86132'),
  ('EG4220 - BRONZO', '#8B4E20'),
  ('EA2245 - ORO', '#AB9116'),
  ('ES9000 - OFF-WHITE', '#EEEFE8'),
  ('EV6005 - VERDE CHIARO', '#8FA284'),
  ('EV6225 - SERPENTINITE', '#88C1B0'),
  ('EV6085 - VERDE BOTTIGLIA (Gamma 22/23)', '#156B5A'),
  ('EV6165 - VERDE FORESTA (RT 22/23)', '#143834'),
  ('EV6450 - OTTANIO', '#187E96'),
  ('ES9455 - ANTRACITE', '#434D50'),
  ('EB5035 - AZZURRO CIELO', '#749BB1'),
  ('EB5005 - GHIACCIO', '#96A1AB'),
  ('EB5105 - BLU REFLEX', '#1350A0'),
  ('EB5205 - BLU OLTROCEANO', '#203353'),
  ('EB5575 - LAVANDA X', '#6A5091'),
  ('ER3180 - ROSSO RUBINO', '#841B37'),
  ('CVSIL - ARGENTO', '#B5C4C8'),
  ('CVRUST - RUST', '#B4724E'),
  ('CVBRX - BRONZO', '#9A5732'),
  ('CVORA - ARANCIONE', '#CA7440'),
  ('CVGOLD - ORO', '#C9AF3D'),
  ('CVBLU - BLU', '#4169D2'),
  ('CVVIO - VIOLA', '#9658A5'),
  ('CVRED - ROSSO', '#AE2D34'),
  ('EV6225-SILVER - Serpentinite', '#C5C5C5'),
  ('EV6225-RUST - Serpentinite', '#CF7526'),
  ('EV6225-RUSTROCK - Serpentinite', '#A39A8F'),
  ('EV6225-GROCK - Serpentinite', '#85C7B4'),
  ('EV6225-MYSTIC - Serpentinite', '#591D75');

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ordem TEXT NOT NULL,
  matricula_quadro TEXT NOT NULL,
  modelo TEXT NOT NULL,
  tamanho TEXT NOT NULL,
  agente_comercial TEXT NOT NULL,
  catalogo_2026 BOOLEAN DEFAULT FALSE,
  cor_base TEXT NOT NULL,
  acabamento_base TEXT NOT NULL,
  acabamento_base_rock BOOLEAN DEFAULT FALSE,
  cor_detalhes TEXT NOT NULL,
  acabamento_detalhes TEXT NOT NULL,
  acabamento_detalhes_rock BOOLEAN DEFAULT FALSE,
  cor_logo TEXT NOT NULL,
  acabamento_logo TEXT NOT NULL,
  acabamento_logo_rock BOOLEAN DEFAULT FALSE,
  cor_letras TEXT NOT NULL,
  acabamento_letras TEXT NOT NULL,
  acabamento_letras_rock BOOLEAN DEFAULT FALSE,
  pedidos_extras TEXT,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Edit history table
CREATE TABLE public.edit_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  edited_by UUID REFERENCES public.users(id) NOT NULL,
  edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Approved users can view orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Approved users can insert orders" ON public.orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Approved users can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Edit history policies
CREATE POLICY "Approved users can view edit history" ON public.edit_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Approved users can insert edit history" ON public.edit_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Admins can delete edit history" ON public.edit_history
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reference tables policies (read-only for approved users)
CREATE POLICY "Approved users can view models" ON public.models
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Approved users can view agents" ON public.agents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Approved users can view colors" ON public.colors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, status)
  VALUES (NEW.id, NEW.email, 'user', 'pending');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes for performance
CREATE INDEX idx_orders_created_by ON public.orders(created_by);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_edit_history_order_id ON public.edit_history(order_id);
CREATE INDEX idx_edit_history_edited_at ON public.edit_history(edited_at DESC);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_status ON public.users(status);
