const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

async function testUpload() {
    const BUCKET_NAME = 'website-assets';
    const filePath = `company/test-${Date.now()}.txt`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, 'hello world', { contentType: 'text/plain' });

    if (error) {
        console.error('Upload Error:', error.message);
    } else {
        console.log('Upload Success:', data);
        const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
        console.log('Public URL:', publicUrlData.publicUrl);
    }
}

testUpload();
