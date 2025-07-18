'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    avatarUrl: '',
    userType: 'worker' as 'worker' | 'business'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  // プロフィール情報を取得
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/signin')
          return
        }

        // Supabaseクライアントを動的に作成
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // 現在のユーザー情報を取得（認証状態を確認）
        const { data: { user } } = await supabase.auth.getUser()
        
        // ユーザー情報が取得できない場合は、localStorageのトークンを使用
        if (!user) {
          // localStorageから直接セッション情報を取得
          const storedSession = localStorage.getItem('supabase.auth.token')
          if (storedSession) {
            const session = JSON.parse(storedSession)
            await supabase.auth.setSession(session)
          } else {
            router.push('/signin')
            return
          }
        }
        
        if (!user) {
          router.push('/signin')
          return
        }

        // プロフィール情報を取得
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (profile) {
          setFormData({
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
            avatarUrl: profile.avatar_url || '',
            userType: profile.user_type?.toLowerCase() || 'worker'
          })
          setIsEditing(true)
        }
      } catch (err) {
        console.error('プロフィール読み込みエラー:', err)
        setError('プロフィール情報の読み込みに失敗しました')
      }
    }

    loadProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/signin')
        return
      }

      // Supabaseクライアントを動的に作成
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(supabaseUrl, supabaseKey)

      // 現在のユーザー情報を取得
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/signin')
        return
      }

      const profileData = {
        id: user.id,
        email: user.email,
        user_type: formData.userType.toUpperCase(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        bio: formData.bio,
        avatar_url: formData.avatarUrl,
        updated_at: new Date().toISOString()
      }

      let result
      if (isEditing) {
        // 更新
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id)
      } else {
        // 新規作成
        result = await supabase
          .from('profiles')
          .insert(profileData)
      }

      if (result.error) {
        throw result.error
      }

      setSuccess(isEditing ? 'プロフィールを更新しました' : 'プロフィールを作成しました')
      setIsEditing(true)
    } catch (err) {
      console.error('プロフィール保存エラー:', err)
      setError('プロフィールの保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'プロフィール編集' : 'プロフィール登録'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEditing ? 'プロフィール情報を更新してください' : 'プロフィール情報を入力してください'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                アカウントタイプ
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="worker">ワーカー（求職者）</option>
                <option value="business">事業者（雇用主）</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  姓 <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="田中"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  名 <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="太郎"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                電話番号
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="090-1234-5678"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                自己紹介
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="自己紹介やスキル、経験などを入力してください"
              />
            </div>

            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                プロフィール画像URL
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/avatar.jpg"
              />
              {formData.avatarUrl && (
                <div className="mt-2">
                  <img
                    src={formData.avatarUrl}
                    alt="プロフィール画像"
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '保存中...' : (isEditing ? '更新する' : '登録する')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage