const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://psfypfwkyqzxcmkntiuz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZnlwZndreXF6eGNta250aXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzQzNzMsImV4cCI6MjA4NzE1MDM3M30.j-DFhfl2A5w5FA2Fn1lrwhzYINSI9zWsHmBwZfSTkUM');

async function check() {
    const { data, error } = await supabase.from('company_settings').select('logo_url').order('updated_at', { ascending: false }).limit(1);
    console.log("Current logo_url in DB:", data?.[0]?.logo_url);
}
check();
