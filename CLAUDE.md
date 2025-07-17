# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Timeeは人材紹介のマッチングシステムです。ワーカー（求職者）と事業者（雇用主）をつなぐプラットフォームで、求人投稿、応募、評価、研修機能を提供します。

## Development Roadmap

### Sprint 1: 基盤構築スプリント
**ゴール**: ユーザーがアプリに登録し、自分のプロフィールを作成できる

**バックエンド要件**:
- ユーザー登録、ログインAPI
- パスワードのハッシュ化とデータベース保存
- JWT認証の実装

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
- 求人投稿API
- 求人一覧取得API

**フロントエンド要件**:
- 事業者向け求人投稿画面
- ワーカー向け求人一覧画面
- 求人詳細画面

### Sprint 3: 「マッチング」スプリント
**ゴール**: ワーカーが仕事に応募し、事業者が応募者を確認できる

**バックエンド要件**:
- 応募(applications)テーブル作成
- 求人応募API
- 事業者向け応募者一覧取得API

**フロントエンド要件**:
- 求人詳細画面の「応募する」ボタン
- 事業者向け応募者確認画面（評価・研修ラベル含む）

### Sprint 4: 「信頼と完了」スプリント
**ゴール**: 業務の完了を記録し、相互評価と研修機能を実装

**バックエンド要件**:
- 評価(ratings)テーブル作成
- 研修(trainings)テーブル作成
- QRコード検証API
- 評価投稿API

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
- PostgreSQL/MySQL for database
- JWT for authentication
- QR code generation/scanning for業務管理

## Important Development Notes

- セキュリティ第一：パスワードは必ずハッシュ化
- ユーザー体験を重視したUI/UX設計
- モバイルファーストでレスポンシブ対応
- API設計はRESTful原則に従う
- データベース設計時はリレーション整合性を考慮
- 段階的開発：各スプリントの完了条件を満たしてから次へ進む
- React/TypeScriptコンポーネントはアロー関数で記述する