<template>
    <div class="main-page" ref="mainPage">
        <div class="top-bar">
            <p class="music-name">{{songInfo[this.idx].name}}</p>
            <p class="author">- {{songInfo[this.idx].artistsName}} -</p>
        </div>
        <div class="background-filter" :style='`background-image:url(${songInfo[this.idx].cover})`'></div>
        <swiper :cover="songInfo[this.idx]" ref="getRotate"></swiper>
        <div class="music">
            <audio :src="`${songInfo[this.idx].url}`"
                   type="audio/mp3"
                   ref="audio"

            ></audio>
            <div class="music-time">
                <div class="start-time time">{{nowTime|dateTime}}</div>
                <div class="progress-bar" ref="track" @click="HandleProgressClick($event)">
                    <div class="load-bar" ref="load"></div>
                    <div class="point-bar" ref="yuandian"
                         @touchstart.stop.prevent="touchstart"
                    ></div>
                    <div class="cur" ref="cur"></div>
                </div>
                <div class="end-time time">{{endTime|dateTime}}</div>
            </div>
            <div class="music-btn">
                <div class="audio-style" @click="onPerv">
                    <span class="left-icon icon"></span>
                </div>
                <div class="audio-style" @click="onPlay">
                    <span :class="[isPlay?'pause-icon':'player-icon']" class="icon" ></span>
                </div>
                <div class="audio-style" @click="onNext">
                    <span class="icon right-icon"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import swiper from "@c/swipe";
    export default {
        name: "index",
        components:{
          swiper
        },
        data(){
            return{
                songInfo:[{
                    albumId: 93162249,
                    albumTitle: "STRAY SHEEP",
                    artistsName: "米津玄師",
                    cover:"https://p1.music.126.net/6mhlWCOOQkT0xDjjuCLW7g==/109951165181187586.jpg",
                    id: 1466598056,
                    index: 7,
                    name: "Lemon",
                    url:"https://music.163.com/song/media/outer/url?id=1466598056.mp3"
                },{
                    artistsName:'LiSA',
                    cover:'https://tse4-mm.cn.bing.net/th/id/OIP.po03cZ8otFBIi_0BCdSEpAHaHW?pid=Api&rs=1',
                    name:'炎',
                    url:'https://gd-sycdn.kuwo.cn/5d27d2bf01fb611fae44657a98d0d659/5faad4ac/resource/n3/96/86/1735096166.mp3'
                }],
                isPlay:false,
                endTime:'',
                nowTime:0,
                overTime:null,
                idx:0,
                pageX:null

            }
        },
       mounted(){
            //监听audio是否结束
           this.$refs.audio.addEventListener('ended',()=>{
                this.nowTime=0
                clearInterval(this.overTime)
                this.isPlay=false
                this.$refs.yuandian.style.left=0+'%'
                this.$refs.cur.style.width=0+'%'
                this.$refs.getRotate.$refs.rotate.style.animationPlayState='paused'
                if(this.idx===this.songInfo.length-1){
                    this.$refs.audio.autoPlay=false
                }else {
                   this.onNext()
                }
            })

           //音频文件准备就绪时候得到总时长
            this.$refs.audio.addEventListener('canplay',()=>{
                this.endTime=this.$refs.audio.duration
            })
        },
        methods:{
            //播放&暂停
            onPlay(){
                if(!this.isPlay){
                    this.$nextTick(() => {
                        this.$refs.audio.play()
                        this.isPlay=!this.isPlay
                        this.time()
                        this.$refs.getRotate.$refs.rotate.style.animationPlayState='running' //控制组件动画
                    })
                }else {
                    this.$nextTick(() => {
                        this.$refs.audio.pause()
                        clearInterval(this.overTime)
                        this.isPlay=!this.isPlay
                        this.$refs.getRotate.$refs.rotate.style.animationPlayState='paused'
                    })

                }
            },


            //定时器
            time(){
                this.$nextTick(() => {
                    this.overTime=setInterval(()=>{
                        // let loadTime=this.$refs.audio.buffered
                        // this.$refs.load.style.width=`${Math.floor(loadTime.end(loadTime.length-1)/parseInt(this.endTime)*100)}%`
                        this.nowTime=this.$refs.audio.currentTime
                        this.point()
                        if(this.nowTime>=this.endTime){
                            clearInterval(this.overTime)
                        }
                    },100)
                })
            },

            //进度条
            point(){
                //得到经过时长百分比
                let leftWidth=(parseInt(this.nowTime)/parseInt(this.endTime))*100;
                //进度条圆点位移
                this.$refs.yuandian.style.left=`${leftWidth}%`
                //进度条填充
                this.$refs.cur.style.width=`${leftWidth}%`
            },

            //下一曲
            onNext(){
                if(this.idx===this.songInfo.length-1){
                    return
                }
                this.$refs.getRotate.$refs.rotate.style.animationPlayState='running'
                this.idx+=1;
                this.reset()
            },
            //上一曲
            onPerv(){
                if(this.idx===0){
                    return
                }
                this.$refs.getRotate.$refs.rotate.style.animationPlayState='running'
                this.idx-=1;
                this.reset()
            },

            //重置
            reset(){
                clearInterval(this.overTime)
                this.$refs.yuandian.style.left=0+'%';
                this.$refs.cur.style.width=0+'%'
                this.$refs.audio.load();
                this.$refs.audio.autoplay=true
                this.isPlay=true
                this.nowTime=0;
                this.time()
            },

            //圆点控制进度条
            touchstart(e){
                clearInterval(this.overTime)
                let round=this.$refs.yuandian;
                let progressWidth=this.$refs.track.offsetWidth // 进度条宽度
                let offsetWidth=round.offsetWidth; //圆点宽度
                let justWidth=progressWidth-offsetWidth //进度条剩余宽度
                let pageX=this.$refs.track.getBoundingClientRect().left //得到进度条离屏幕的宽度

                round.ontouchmove=(e)=>{  //元素移动
                    e.preventDefault(); //阻止元素默认行为
                    let moveX=e.touches[0].pageX; //当前元素的X轴
                    let leftX=((moveX-pageX)/justWidth.toFixed(2)) //得到当前进度条百分比
                    this.nowTime=this.$refs.audio.duration*leftX  //赋值经过时间
                    if((moveX-pageX)>=justWidth){              //判断是否超过进度条
                        leftX=1
                        this.nowTime=this.$refs.audio.duration
                    }
                    if((moveX-pageX)<=0){
                        leftX=0
                        this.nowTime=0
                    }

                    round.style.left=`${leftX*100}%`  //圆点移动
                    this.$refs.cur.style.width=`${leftX*100}%` //填充条移动
                    round.ontouchend=()=>{  //元素停止移动
                        e.preventDefault()
                        if(!this.isPlay){
                            this.onPlay()
                        }else {
                            this.time()
                        }
                        this.$refs.audio.currentTime=this.$refs.audio.duration*leftX

                    }
                }

            },

            //点击进度条
            HandleProgressClick(e){
                if(!this.isPlay){
                    this.onPlay()
                }
                let progressWidth=this.$refs.track.offsetWidth; //进度条宽度
                let clickX = e.offsetX;     //当前点击的位置相对于触发事件对象的X坐标
                let time=(clickX / progressWidth).toFixed(2);   //当前进度
                this.$refs.audio.currentTime=this.$refs.audio.duration*time;    //总时长*元素当前进度=点击进度条后已播放时长
            }
        },


        filters:{
            //歌曲时间转换
            dateTime(val){
                let hour=Math.floor(val/3600)+'';
                let min=Math.floor(val/60)%60+'';
                let second =Math.floor(val%60)+'';
                if(min>=60){
                    return `${hour.padStart(2,'0')}:${min.padStart(2,'0')}:${second.padStart(2,'0')}`
                }else {
                    return `00:${min.padStart(2,'0')}:${second.padStart(2,'0')}`
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-page{
        width: 100%;
        position: relative;
        .top-bar{
            width: 100%;
            height: 1.2rem;
            text-align: center;
            color: #ffff;
            line-height: 0.6rem;
            .author{
                margin-top: 0.1rem;
                font-size: 0.4rem;
            }
            .music-name{
                font-weight: 500;
                font-size: 0.6rem;
            }
        }
        .background-filter{
            position: fixed;
            z-index: -2;
            top:0;
            left: 0;
            background-size: cover;
            width: 100%;
            height: 100vh;
            background-position: 50%;
            filter: blur(0.2rem);
            opacity: 0.7;
            overflow: hidden;
            box-sizing: border-box;
            background-repeat: no-repeat;
        }
        .music{
            position: fixed;
            bottom:1em;
            width: 100%;
            .music-time{
                width: 100%;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                justify-content:space-around;
                overflow: hidden;
                padding-bottom: 0.7rem;
                padding-right: 0.2rem;
                .time{
                    font-size: 0.32rem;
                    color: #f8f8f8;
                }
                .progress-bar{
                    width: 3.7rem;
                    height: 0.08rem;
                    background: #f8f7f7;
                    border-radius: 4px;
                    position: relative;
                    box-sizing: border-box;
                    .load-bar{
                        position: absolute;
                        top:0;
                        left: 0;
                        height: 0.08rem;
                        z-index: 997;
                        border-radius: 0 4px 4px 0;
                        background: #585555;
                    }
                    .point-bar{
                        width: 0.28rem;
                        height: 0.28rem;
                        position: absolute;
                        left: 0;
                        top:50%;
                        z-index: 999;
                        background: #ffff;
                        border-radius: 50%;
                        transform: translateY(-50%);

                    }
                    .cur{
                        position: absolute;
                        height: 0.08rem;
                        left:0;
                        top:0;
                        background: #e02d2d;
                        z-index: 998;
                        box-sizing: border-box;
                        border-radius: 4px 0 0 4px;
                    }
                }
            }
            .music-btn{
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding-right: 0.2rem;
                .audio-style{
                    width: 0.8rem;
                    height: 0.8rem;
                    .icon{
                        width: 100%;
                        height: 100%;
                        display: block;
                        background-repeat: no-repeat;
                        background-size: 100%;
                    }
                    .left-icon{
                        background-image: url("../../assets/img/left.png");
                    }
                    .right-icon{
                        background-image: url("../../assets/img/right.png");
                    }
                    .player-icon{
                        background-image: url("../../assets/img/play.png");
                    }
                    .pause-icon{
                        background-image: url("../../assets/img/pause.png");
                    }
                }
            }

        }
    }
</style>