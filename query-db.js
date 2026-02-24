const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://psfypfwkyqzxcmkntiuz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZnlwZndreXF6eGNta250aXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NzQzNzMsImV4cCI6MjA4NzE1MDM3M30.j-DFhfl2A5w5FA2Fn1lrwhzYINSI9zWsHmBwZfSTkUM');

async function test() {
    const { data, error } = await supabase.from('products').insert([{ name: 'test', image_url: 'test', image_alt: 'alt' }]);
    console.log(error);

    const { data: d2, error: e2 } = await supabase.from('news_articles').insert([{ title: 'test', image_url: 'test', image_alt: 'alt' }]);
    console.log(e2);
}
test();
