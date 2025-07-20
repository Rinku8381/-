# Seraphine Hybrid V1.5 - Free Access Dashboard

## 🚀 Overview

A cyberpunk-themed, futuristic AI Smart Home dashboard built with Next.js and React. Features immersive neon aesthetics, animated backgrounds, and modular panel components for managing AI features, tokens, and user settings.

## 🎨 Visual Style

- **Cyberpunk Theme**: Dark backgrounds with neon cyan (#00ffff), magenta (#ff00ff), and purple glows
- **Animated Elements**: Neural grid patterns, floating particles, hover effects with glow and flicker
- **Modern Layout**: Responsive CSS Grid/Flexbox, glassmorphism effects with backdrop blur
- **Interactive UI**: Smooth transitions, animated buttons, and holographic-style modals

## 📁 Component Structure

### Dashboard Layout (`/src/app/dashboard/free/page.tsx`)

Main dashboard page with:

- Animated cyberpunk background with neural grid and particles
- User profile header with token display
- Quick action cards for AI features
- Daily usage limits with progress indicators
- Premium preview section with upgrade CTA

### Panel Components (`/src/components/dashboard/`)

#### 1. User Settings Panel (`UserSettingsPanel.tsx`)

- **Profile Management**: Edit username, email, avatar
- **Preferences**: Theme selection (dark/cyberpunk/neon), language, volume control
- **Notifications**: Email, push, voice notification toggles
- **Security**: Two-factor auth, login alerts, password change

#### 2. Studio Library (`StudioLibrary.tsx`)

- **Media Management**: AI-generated images, videos, voices, avatars
- **Organization**: Pin favorites, search/filter by type
- **Actions**: Download, share, play preview
- **Free Limitations**: Video preview only, limited storage

#### 3. Mini AI Features (`MiniAIFeatures.tsx`)

- **Free Features**:
  - Image Generator (3/day)
  - Voice Generator (5/day)
  - Video Snippet (1 second, 1/day)
  - Avatar Preview (locked editor)
- **Premium Features**: Locked with blur overlay and upgrade prompts
- **Daily Limits**: Visual progress bars with reset timers

#### 4. Invite & Token Panel (`InviteTokenPanel.tsx`)

- **Referral System**: Generate unique codes and links
- **Reward Structure**:
  - Friend joins: +20 tokens each
  - Friend subscribes: +100 bonus tokens
  - Monthly active: +50 tokens
- **Social Sharing**: WhatsApp, Telegram integration
- **Statistics**: Total referrals, tokens earned, pending rewards

#### 5. Shop Panel (`ShopPanel.tsx`)

- **Token Packages**: 100-2500 tokens with bonus amounts
- **Premium Features**: Individual feature unlocks with token costs
- **Subscription Plans**: Basic/Pro/Enterprise with monthly/yearly toggle
- **Payment Integration**: Ready for Stripe/PayPal integration

#### 6. Subscription Popup (`SubscriptionPopup.tsx`)

- **Context-Aware**: Different content based on trigger (login/limit/upgrade)
- **Plan Comparison**: Feature matrix with visual highlights
- **Special Offers**: Welcome bonuses, limited-time discounts
- **Call-to-Action**: Prominent upgrade buttons with animations

## 🎯 Key Features

### Responsive Design

- **Mobile-First**: Adaptive grid layouts for all screen sizes
- **Touch-Friendly**: Large tap targets, swipe gestures
- **Performance**: Optimized animations, lazy loading

### Accessibility

- **ARIA Labels**: Screen reader support for all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: High contrast ratios for cyberpunk theme
- **Alternative Text**: Descriptive alt text for all images

### State Management

- **React Hooks**: useState/useEffect for component state
- **Mock Data**: Realistic placeholder data for development
- **API Ready**: Structured for easy backend integration

### Animations & Effects

- **CSS Animations**: Keyframe animations for particles, glows
- **Hover Effects**: Subtle transforms, shadow changes
- **Loading States**: Spinners, progress indicators
- **Transitions**: Smooth page/modal transitions

## 🛠 Technical Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: CSS Modules with cyberpunk theme
- **Icons**: Lucide React (consistent, lightweight)
- **TypeScript**: Full type safety
- **Build**: Optimized for production deployment

## 🎮 Usage Examples

### Opening Panels

```tsx
// From dashboard quick actions
<button onClick={() => handlePanelOpen('userSettings')}>
  <Settings size={24} />
  User Settings
</button>;

// Panel renders conditionally
{
  activePanel === 'userSettings' && (
    <UserSettingsPanel isVisible={true} onClose={handlePanelClose} />
  );
}
```

### Token System Integration

```tsx
// Pass user tokens to components
<ShopPanel
  userTokens={userData.tokens}
  onUpgrade={handleUpgrade}
/>

<InviteTokenPanel
  userTokens={userData.tokens}
  onClose={handlePanelClose}
/>
```

### Daily Limits Display

```tsx
// Progress bar with cyberpunk styling
<div className={styles.progressContainer}>
  <div className={styles.progressBar}>
    <div className={`${styles.progressFill} ${styles[`progress${percent}`]}`} />
  </div>
</div>
```

## 🚀 Deployment

### Development

```bash
npm run dev
# Starts development server on localhost:3000
```

### Production Build

```bash
npm run build
npm start
# Optimized production build
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.seraphine.ai
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🎨 Customization

### Theme Colors

Modify CSS custom properties in `dashboard.module.css`:

```css
:root {
  --primary-cyan: #00ffff;
  --primary-magenta: #ff00ff;
  --accent-gold: #ffd700;
  --bg-primary: #0f0225;
  --bg-secondary: #000511;
}
```

### Animation Timing

Adjust animation durations:

```css
.particle {
  animation: float1 8s ease-in-out infinite; /* Slower */
}

.neuralGrid {
  animation: neuralPulse 2s ease-in-out infinite; /* Faster */
}
```

## 📱 Mobile Optimization

- Responsive grid breakpoints at 768px, 1024px
- Touch-optimized button sizes (44px minimum)
- Swipe gestures for modal navigation
- Reduced animations on mobile for performance

## 🔮 Future Enhancements

- **Lottie Animations**: Advanced avatar animations
- **Voice Interface**: Voice command integration
- **AR/VR Support**: 3D dashboard elements
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Usage insights dashboard

## 📄 License

MIT License - Built for Seraphine Hybrid V1.5 AI Smart Home System
