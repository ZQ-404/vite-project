/**
 * 环境配置封装
 */
//mode开发模式
const env=import.meta.env.MODE || 'production';
//开发环境下的请求地址
//baseAPI表示线上的
//mockAPI表示线下的
const EnvConfig={
    development:{
        baseApi:'/api',
        mockApi:'https://www.fastmock.site/mock/dc7d68a508467c4a16dea5d7753bb87e/api'
    },
    test:{
        baseApi:'/',
        mockApi:'https://www.fastmock.site/mock/dc7d68a508467c4a16dea5d7753bb87e/api'
    },
    production:{
        baseApi:'/',
        mockApi:'https://www.fastmock.site/mock/dc7d68a508467c4a16dea5d7753bb87e/api'
    }
}
//将开发模式值、mock开关值、服务请求地址，导出备用
export default{
    env,
    mock:false,
    ...EnvConfig[env],
    namespace:'manager'
}