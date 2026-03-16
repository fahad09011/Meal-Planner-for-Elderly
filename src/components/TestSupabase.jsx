import { useEffect } from "react";
import { supabase } from "../services/supabaseClient";

function TestSupabase() {

  useEffect(() => {

    async function testConnection() {
       const{data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
            email:"elderly@test.com",
            password:"test12345"
            // from password
        });
        console.log("Sign in data:", signInData);
        console.log("Sign in error:", signInError);


      const { data: userData, error: userError} = await supabase.auth.getUser()
      console.log("Logged User", userData);
      console.log("Get user error:", userError);


      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      console.log("Profiles data:", data);
      console.log("Profile Error:", error);

    }

    testConnection();

  }, []);

  return <div>Testing Supabase connection...</div>;
}

export default TestSupabase;