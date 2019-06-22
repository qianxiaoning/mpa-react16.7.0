require('./dao.js');

import './index.less';
import '@/global.less';
import React from 'react';
import ReactDOM from 'react-dom';
// 国际化
import { LocaleProvider, Button, DatePicker, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// 小图
import littlePic from '@/assets/littlePic.png';
// 大图
import bigPic from '@/assets/bigPic.png';
// 组件
import ComponentA from '@/components/componentA/componentA';
import zh from './locales/zh-CN';
import en from './locales/en-US';

const $t = (id) => {
    const storageLang = localStorage.lang;
    const lang = storageLang === 'zh-CN' ? 'zh-CN' : 'en-US';
    let langObj = en;
    if(lang === 'en-US'){
        langObj = en;
    }else if(lang === 'zh-CN'){
        langObj = zh;
    }
    return langObj[id];
};
class A extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            a: 1,
            name: 'componentA1',
            lang: localStorage.lang
        };
    }

    componentDidMount(){
        // a
    }

    // bind传参，接收时，事件对象e要放在最后
    langClick(s, e){
        e.preventDefault();
        localStorage.lang = s;
        this.setState({
            lang: s
        });
    }

    render() {
        return (
            <div>
                <Spin />
                <span onClick={this.langClick.bind(this, 'zh-CN')}>中文</span>
                <span onClick={this.langClick.bind(this, 'en-US')}>english</span>
                <div>{$t('tip')}</div>
                <p className='hidden'>{this.state.lang === 'zh-CN' ? 11 : 22}</p>
                <DatePicker />
                <Button type='primary'>Primary</Button>
                <ComponentA name={this.state.name} />
                <span>{this.state.a}</span>
                <img src={littlePic} alt='' />
                <img src={bigPic} alt='' />
                <div className='cssImg'></div>
            </div>
        );
    }
}
ReactDOM.render(<LocaleProvider locale={localStorage.lang === 'zh-CN' ? zhCN : null}><A /></LocaleProvider>, document.getElementById('moduleRoot'));
