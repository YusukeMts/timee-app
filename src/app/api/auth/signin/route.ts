import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Supabaseクライアントを動的に作成
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    /*ログイン認証*/
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    /* プロフィール情報の取得*/
    // 認証済みユーザーのクライアントを作成
    const authenticatedSupabase = createClient(supabaseUrl, supabaseKey)
    await authenticatedSupabase.auth.setSession(data.session)
    
    const { data: profile, error: profileError } = await authenticatedSupabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // プロフィールが見つからない場合はプロフィール作成を促す
    if (profileError) {
      return NextResponse.json({ 
        message: 'Login successful - Profile setup required',
        user: data.user,
        session: data.session,
        needsProfile: true
      })
    }

    return NextResponse.json({ 
      message: 'Login successful',
      user: data.user,
      profile,
      session: data.session
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}