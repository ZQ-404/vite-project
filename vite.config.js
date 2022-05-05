import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const {resolve} =require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
		alias:{
			'@':resolve(__dirname,'src')
		}
	},
  server:{
    host:'localhost',
    port:8080,
    //代理进行接口转发
    proxy:{
      "/api":{
        target:"http://localhost:3000"
      }
    }
  },
  plugins: [vue()]
})
