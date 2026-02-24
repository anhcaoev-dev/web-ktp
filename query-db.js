const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://psfypfwkyqzxcmkntiuz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZnlwZndreXF6eGNta250aXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzQzNzMsImV4cCI6MjA4NzE1MDM3M30.j-DFhfl2A5w5FA2Fn1lrwhzYINSI9zWsHmBwZfSTkUM');

async function test() {
    const { data: d1 } = await supabase.from('products').select('*').limit(1);
    console.log(d1 ? Object.keys(d1[0] || {}) : []);

    const { data: d2 } = await supabase.from('news_articles').select('*').limit(1);
    console.log(d2 ? Object.keys(d2[0] || {}) : []);
}
test();
