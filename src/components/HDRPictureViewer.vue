<script>
import { ipcRenderer } from 'electron'
import { IconSync, IconClose } from '@arco-design/web-vue/es/icon';
import { shell } from 'electron'

export default {
  components: { IconSync, IconClose },
  name: 'HDRPictureViewer',
  data() {
    return {
      srcList: [],
      tipShow: true,
      SDRSupport: false,
      HDRSupport: false,
      collapseHide: true,
    }
  },
  methods: {
    selectDirectory() {
      ipcRenderer.send('select-directory')
    },
    clearAll() {
      this.srcList = []
    },
    hdrCheck() {
      this.SDRSupport = window.matchMedia("(dynamic-range: standard)").matches
      this.HDRSupport = window.matchMedia("(dynamic-range: high)").matches
    },
    gotoBrowser(url) {
      shell.openExternal(url);
    }
  },
  mounted() {
    ipcRenderer.on('photo-paths', (event, photoPaths) => {
      console.log("photoPaths", photoPaths)
      // 设置照片预览列表
      this.srcList = photoPaths
    }),
      this.hdrCheck()
  },
  created() {
    const localTipShow = localStorage.getItem('tipShow');
    if (localTipShow !== null) {
      this.tipShow = JSON.parse(localTipShow);
    }
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners('photo-paths')
  },
  watch: {
    tipShow(newTipShow) {
      localStorage.setItem('tipShow', JSON.stringify(newTipShow));
    }
  }
}
</script>

<template>
  <div class="home">
    <a-layout style="height: 100%;">
      <a-layout-header>
        <a-collapse bordered="false" :destroy-on-hide="collapseHide"  v-if="tipShow" style="margin: 10px;">
          <a-collapse-item  header="如何验证我可以查看 HDR 照片" key="1" style="text-align: left; line-height: 25px;">
            <div style="position: absolute; top: 10px; right: 20px;" @click="this.tipShow = !this.tipShow">
              <a-link>不在提示？<icon-close /></a-link>
            </div>
            <div>1. 当前设备支持情况</div>
            <span style="width: 10px;">SDR: </span><a-switch :model-value="SDRSupport" disabled />
            <br />
            <span style="width: 10px;">HDR: </span><a-switch :model-value="HDRSupport" disabled />
            <br />
            <br />
            <div>
              2. HDR 图片测试 <a-link  @click="gotoBrowser('https://laichi.cc/article/avif-viewing-test#f9fe746a849141c6b7a6da4bc286de3elaichi.cc/article/avif-viewing-test#f9fe746a849141c6b7a6da4bc286de3e')" >原文章地址</a-link>
              <a-image height="20" src="avif_peak.avif" style="display: block;margin: 10px 0;" />
              <div>
                这是一个从 10000nit 到 400nit 的带15个圆点的渐变，其中最右侧的圆点应为1000nit
              </div>
              <div>
                如果你看到最左边的圆点是和背景相同的白色（周围的渐变略有一点点灰），到最右边变更灰，那么表示此时你并没有看到HDR效果，HDR内容可能被当作SDR来处理了
              </div>
              <div>
                如果你什么都没看见，说明图片不被识别，或整张图片被当作比白更白的内容“过曝”了
              </div>
              <div>
                如果你看到最左边是很刺眼的、比背景更白的白色，那么起码你有了HDR效果
              </div>
              <div>
                在有HDR的前提下，如果你看到渐变在中间处才开始向右逐渐变暗，那么说明你看到了约1000nit的峰值亮度，且超出的部分由于“顶不上去”而裁切
              </div>
            </div>
          </a-collapse-item>
        </a-collapse>
        <a-button style="margin: 0 10px;" type="primary" @click="selectDirectory">选择目录</a-button>
        <a-button type="primary" @click="clearAll">
          <template #icon>
            <icon-sync />
          </template>
          <template #default>清除</template>
        </a-button>
      </a-layout-header>
      <a-layout-content>

        <template v-if="this.srcList.length === 0">
          <a-empty style="margin: 10px; height: 100%;" />
        </template>
        <template v-else>
          <a-image-preview-group infinite>
            <a-space wrap style="margin: 10px;">
              <a-image v-for="(item, index) in srcList"
              :src="item" 
              width="200px" 
              height="200px" 
              fit="cover" 
              show-loader>
              </a-image>
            </a-space>
          </a-image-preview-group>
        </template>
      </a-layout-content>
    </a-layout>
    <div style="position: absolute; bottom: 20px; right: 20px;">
      <div style="text-align:right;">
        <a-button shape="circle" status="warning" @click="this.tipShow = true; this.collapseHide = false"> <template #icon><icon-question /></template> </a-button>
      </div>
      powered by <a-link @click="gotoBrowser('https://space.bilibili.com/2905988?spm_id_from=333.1007.0.0')" icon>无笙</a-link>
    </div>
  </div>
</template>

<style scoped>
.list-img {
  margin: 0 10px;
}
</style>
