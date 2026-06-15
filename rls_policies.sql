-- RLS aktivieren für alle Tabellen
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Öffentlicher Lese-Zugriff für alle Tabellen
CREATE POLICY "Allow public read access" ON surveys FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON options FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON votes FOR SELECT USING (true);

-- Öffentlicher Schreib-Zugriff für alle Tabellen
CREATE POLICY "Allow public insert access" ON surveys FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON options FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON votes FOR INSERT WITH CHECK (true);

-- Öffentlicher Update-Zugriff für alle Tabellen
CREATE POLICY "Allow public update access" ON surveys FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update access" ON questions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update access" ON options FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public update access" ON votes FOR UPDATE USING (true) WITH CHECK (true);

-- Öffentlicher Lösch-Zugriff für alle Tabellen
CREATE POLICY "Allow public delete access" ON surveys FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON questions FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON options FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON votes FOR DELETE USING (true);