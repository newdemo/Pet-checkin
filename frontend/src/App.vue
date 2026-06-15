<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { initAppData } from './services/storage'

onLaunch(() => {
  initAppData()
})
</script>

<style lang="scss">
page {
  background-color: $bg;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  color: #333;
}
</style>
