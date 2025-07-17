import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const POST = async (request: NextRequest) => {
  try {
    const { email, password, user_type, first_name, last_name } = await request.json()

    if (!email || !password || !user_type) {
      return NextResponse.json(
        { error: 'Email, password, and user_type are required' },
        { status: 400 }
      )
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user) {
      const { error: profileError } = await supabase
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