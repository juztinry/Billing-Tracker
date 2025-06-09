import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can connect to Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { success: false, error: `Session error: ${sessionError.message}` };
    }
    
    console.log('Session check passed. User:', session?.user?.email || 'No user logged in');
    
    // Test 2: Check if we can access the database (try to query a simple table)
    const { data, error: dbError } = await supabase
      .from('water_bills')
      .select('count')
      .limit(1);
    
    if (dbError) {
      console.error('Database error:', dbError);
      
      // Check if it's a table not found error
      if (dbError.message.includes('relation "public.water_bills" does not exist')) {
        return { 
          success: false, 
          error: 'Database tables not found. Please run the database setup script.',
          needsSetup: true
        };
      }
      
      return { success: false, error: `Database error: ${dbError.message}` };
    }
    
    console.log('Database connection test passed');
    
    // Test 3: Check if user is authenticated for database operations
    if (session?.user) {
      const { data: userBills, error: userError } = await supabase
        .from('water_bills')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);
      
      if (userError) {
        console.error('User-specific query error:', userError);
        return { success: false, error: `User query error: ${userError.message}` };
      }
      
      console.log('User-specific query test passed');
    }
    
    return { success: true, message: 'All connection tests passed' };
    
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
}
