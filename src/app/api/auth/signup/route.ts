import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password, user_type, first_name, last_name } = await request.json()

    if (!email || !password || !user_type) {
      return NextResponse.json(
        { error: 'Email, password, and user_type are required' },
        { status: 400 }
      )
    }

    // Supabaseクライアントを動的に作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user && authData.session) {
      // 認証済みユーザーのクライアントを作成
      const authenticatedSupabase = createClient(supabaseUrl, supabaseKey)
      await authenticatedSupabase.auth.setSession(authData.session)

      const { error: profileError } = await authenticatedSupabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          user_type,
          first_name: first_name || null,
          last_name: last_name || null,
        })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ 
      message: 'User created successfully',
      user: authData.user 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}