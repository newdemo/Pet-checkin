<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { initAppData } from './services/storage'

onLaunch(() => {
  initAppData()
})
</script>

<style lang="scss">
@import './uni.scss';

page {
  background-color: #fff8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  color: #333;
}
</style>
