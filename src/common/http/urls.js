const host_dev = '/eoop-api';//开发以'/'本地localhost发起
const host_prod = 'http://app-uat.gtcloud.cn/eoop-api';
// 根据 process.env.NODE_ENV 判断 开发或生产接口地址
const host = process.env.NODE_ENV == 'development' ? host_dev : host_prod;
// const host = host_prod;

// 后台各个服务地址头
// const hostV1 = host + '/v1';
// const hostV2 = host + '/v2';
// const hostV3 = host + '/v3';
// const hostV4 = host + '/v4';

const urls = {
    // 登录
    login:host+'/r/sys/rest/login4OtherSystem',
    //用户信息
    getUserInfo:host+'/r/sys/rest/getUserInfoByEmpAdname/',
    //判断角色 普通员工/处理人
    isReportHandler:host+'/r/it/report/isReportHandler',
    //事项1类别 2分类
    getCategory:host+'/r/it/report/getCategory',
    //问题列表
    getReportFaqPage:host+'/r/it/report/getReportFaqPage',
    //问题详情
    getReportFaq:host+'/r/it/report/getReportFaq',
    //事项状态
    getStatus:host+'/r/it/report/getStatus',
    //我的事项列表
    getMyReportPage:host+'/r/it/report/getMyReportPage',
    //处理事项列表
    getReportPageForHandler:host+'/r/it/report/getReportPageForHandler',
    //事项详情
    getReport:host+'/r/it/report/getReport',
    //上传附件
    upload:host+'/r/it/report/upload',
    //发起事项
    saveReport:host+'/r/it/report/saveReport',
    //已办结事项
    closeReport:host+'/r/it/report/closeReport',
    //已处理事项
    solveReport:host+'/r/it/report/solveReport',
    //未解决事项
    setReportUnsolved:host+'/r/it/report/setReportUnsolved',
    //获取转交用户
    getOtherReportHandler:host+'/r/it/report/getOtherReportHandler',
    //转交事项
    transferReport:host+'/r/it/report/transferReport',
}

export default urls;
