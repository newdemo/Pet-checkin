<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { initAppData } from './services/storage'
import { CLOUD_ENV_ID } from './constants/config'

onLaunch(() => {
  initAppData()
  try {
    wx.cloud.init({ env: CLOUD_ENV_ID, traceUser: true })
    console.log('[App] wx.cloud.init 完成，环境:', CLOUD_ENV_ID)
  } catch (e) {
    console.warn('[App] wx.cloud.init 失败（非小程序环境可忽略）:', e.message || e)
  }
})
</script>

<style lang="scss">
page {
  background-color: $bg;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  color: #333;
}
</style>
