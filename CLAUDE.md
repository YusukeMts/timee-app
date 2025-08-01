# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Timeeは人材紹介のマッチングシステムです。ワーカー（求職者）と事業者（雇用主）をつなぐプラットフォームで、求人投稿、応募、評価、研修機能を提供します。

## Development Roadmap

### Sprint 1: 基盤構築スプリント
**ゴール**: ユーザーがアプリに登録し、自分のプロフィールを作成できる

**バックエンド要件**:
- ✅ Supabase認証システム（APIレス）
- ✅ 自動セッション管理
- ✅ RLS（Row Level Security）設定

**フロントエンド要件**:
- 新規登録画面
- ログイン画面  
- ワーカーのプロフィール登録・編集画面
- APIとの接続

### Sprint 2: 「しごと」スプリント
**ゴール**: 事業者が求人を投稿でき、ワーカーがその一覧をアプリで見ることができる

**バックエンド要件**:
- 求人(jobs)テーブル作成
- 店舗(shops)テーブル作成
- RLS（Row Level Security）設定
- Supabase直接操作（APIレス）

**フロントエンド要件**:
- 事業者向け求人投稿画面
- ワーカー向け求人一覧画面
- 求人詳細画面

### Sprint 3: 「マッチング」スプリント
**ゴール**: ワーカーが仕事に応募し、事業者が応募者を確認できる

**バックエンド要件**:
- 応募(applications)テーブル作成
- RLS（Row Level Security）設定
- Supabase直接操作（APIレス）

**フロントエンド要件**:
- 求人詳細画面の「応募する」ボタン
- 事業者向け応募者確認画面（評価・研修ラベル含む）

### Sprint 4: 「信頼と完了」スプリント
**ゴール**: 業務の完了を記録し、相互評価と研修機能を実装

**バックエンド要件**:
- 評価(ratings)テーブル作成
- 研修(trainings)テーブル作成
- QRコード検証API（複雑なロジックのため）
- Supabase直接操作（基本的なCRUD）

**フロントエンド要件**:
- QRコード表示・読み取り画面
- 研修動画視聴画面
- 相互評価画面

## Database Schema

### Core Tables
- `users` - ユーザー情報（ワーカー・事業者共通）
- `profiles` - ユーザープロフィール詳細
- `shops` - 店舗情報
- `jobs` - 求人情報
- `applications` - 応募情報
- `ratings` - 評価情報
- `trainings` - 研修情報

## Technology Stack

### Recommended Framework
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Required Packages
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Development Commands
```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Run linting
```

## Architecture Notes

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Supabase (PostgreSQL) for database
- Supabase Auth（JWTベース）for authentication
- @supabase/ssr for session management
- QR code generation/scanning for業務管理

## API Design Philosophy

### APIが必要な場面
- 複雑なビジネスロジック（給与計算、評価集計など）
- 外部サービス連携（メール送信、SMS、決済処理）
- データの加工・集計（レポート生成、統計）
- セキュリティが重要な処理（管理者権限操作）
- 複数のデータソースの結合

### APIが不要な場面（Supabaseで直接処理）
- シンプルなCRUD操作
- 認証処理（signup/signin）
- リアルタイム機能
- 基本的なデータ取得・更新

## 実装済み機能

### Sprint 1: 基盤構築スプリント ✅

**バックエンド実装済み**:
- ✅ Supabase認証システム設定
  - ✅ Supabaseプロジェクト作成・設定
  - ✅ 環境変数設定（NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY）
  - ✅ @supabase/supabase-js, @supabase/ssr パッケージインストール
  - ✅ Supabase クライアント設定（/src/lib/supabase.ts）
- ✅ 認証機能実装
  - ✅ signUp（メール/パスワード認証）
  - ✅ signIn（ログイン機能）
  - ✅ signOut（ログアウト機能）
  - ✅ getUser（セッション確認）
  - ✅ メール認証フロー
- ✅ データベース設計・実装
  - ✅ profilesテーブル作成
  - ✅ Database Triggers（自動プロフィール作成）
  - ✅ RLS（Row Level Security）ポリシー設定
  - ✅ TypeScript型定義（Database型）
- ✅ セッション管理
  - ✅ @supabase/ssr による自動セッション管理
  - ✅ クライアントサイド認証状態管理
  - ✅ 認証状態に応じたUI切替

**フロントエンド実装済み**:
- ✅ 新規登録画面 (`/signup`)
- ✅ ログイン画面 (`/signin`)
- ✅ プロフィール登録・編集画面 (`/profile`)
- ✅ アロー関数によるコンポーネント実装
- ✅ Tailwind CSSによるレスポンシブデザイン
- ✅ エラーハンドリング
- ✅ 登録成功メッセージ表示
- ✅ Supabase自動セッション管理

**デプロイ・インフラ**:
- ✅ GitHubリポジトリ連携
- ✅ Vercelデプロイ設定
- ✅ 環境変数設定
- ✅ ビルドエラー修正（Suspense boundary対応）

**認証フロー実装済み**:
- ✅ Database Triggersで自動プロフィール作成 (`supabase/migrations/001_create_auto_profile_trigger.sql`)
- ✅ 完全な認証フロー（新規登録→メール認証→ログイン→ログアウト）
- ✅ 認証状態に応じた画面表示切替
- ✅ セッション管理とセキュアな認証処理

**ランディングページ実装済み**:
- ✅ モダンなトップページデザイン（グラデーション背景、レスポンシブ対応）
- ✅ 認証状態に応じたヘッダーメニュー切替
- ✅ ヒーローセクション「働き方を、つなげよう」
- ✅ 3つの特徴紹介（マッチング・安心安全・スピーディー）
- ✅ CTAボタン（未認証：今すぐ始める/ログイン、認証済み：プロフィール画面へ）

**完成したページ**:
- ✅ `/` - モダンなランディングページ（認証状態対応、ログアウト機能付き）
- ✅ `/signup` - 新規登録（姓名、アカウントタイプ選択対応）
- ✅ `/signin` - ログイン（プロフィール確認後の適切な画面誘導）
- ✅ `/profile` - プロフィール編集（自動作成されたプロフィールの更新）

### 次のタスク
- 🔄 Sprint 2「しごと」スプリントの開始

## Important Development Notes

- セキュリティ第一：パスワードは必ずハッシュ化
- ユーザー体験を重視したUI/UX設計
- モバイルファーストでレスポンシブ対応
- API設計はRESTful原則に従う
- データベース設計時はリレーション整合性を考慮
- 段階的開発：各スプリントの完了条件を満たしてから次へ進む
- React/TypeScriptコンポーネントはアロー関数で記述する
- useSearchParams()は必ずSuspense boundaryで囲む
- Supabaseの自動セッション管理を使用し、手動localStorage操作は避ける