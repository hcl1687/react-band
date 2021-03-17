import lottie from 'lottie-web'

declare global {
  namespace Lottie {
    type ILottie = typeof lottie
  }
}
