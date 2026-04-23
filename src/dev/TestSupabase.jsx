import { useEffect } from "react";
import { supabase } from "../services/database/supabaseClient";

function TestSupabase() {

  useEffect(() => {

    async function testConnection() {
      await supabase.auth.signInWithPassword({
        email: "elderly@test.com",
        password: "test12345"

      });
      await supabase.auth.getUser();

      await supabase.
      from("profiles").
      select("*");

    }

    testConnection();

  }, []);

  return <div>Testing Supabase connection...</div>;
}

export default TestSupabase;