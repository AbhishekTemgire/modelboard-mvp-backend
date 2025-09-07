import { sql } from "../config/supabase.js";

const profiles = {
    
   //Find profile
  async findById(id) {
    const rows = await sql`
      SELECT id, username, display_name, avatar_url, role
      FROM public.profiles
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] || null;
  },

  //new users
  async create({ id, email, username, display_name, avatar_url, role = "user" }) {
    const rows = await sql`
      INSERT INTO public.profiles (id, email, username, display_name, avatar_url, role)
      VALUES (${id}, ${email}, ${username}, ${display_name}, ${avatar_url}, ${role})
      RETURNING id, email, username, display_name, avatar_url, role
    `;
    return rows[0];
  },

   //update profile
  async update(id, { username, display_name, avatar_url }) {
    const rows = await sql`
      UPDATE public.profiles
      SET 
        username = COALESCE(${username}, username),
        display_name = COALESCE(${display_name}, display_name),
        avatar_url = COALESCE(${avatar_url}, avatar_url),
        updated_at = now()
      WHERE id = ${id}
      RETURNING id, username, display_name, avatar_url, role
    `;
    return rows[0];
  },
};

export default profiles;
