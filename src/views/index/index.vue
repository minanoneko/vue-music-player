<template>
    <div class="main-page">
        <div class="top-bar">
            <p class="music-name">{{songInfo[this.idx].name}}</p>
            <p class="author">- {{songInfo[this.idx].artistsName}} -</p>
        </div>
        <div class="background-filter" :style='`background-image:url(${songInfo[this.idx].cover})`'></div>
        <swiper :cover="songInfo[this.idx]" :is-play="isPlay"></swiper>
        <div class="music">
            <audio :src="`${songInfo[this.idx].url}`"
                   type="audio/mp3"
                   ref="audio"
                   @canplay="updateTime"
            ></audio>
            <div class="music-time">
                <div class="start-time time">{{startTime|dateTime}}</div>
                <div class="progress-bar">
                    <div class="load-bar" ref="load"></div>
                    <div class="point-bar" ref="yuandian"></div>
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
                    url:'https://webfs.yun.kugou.com/202011092302/a9bdc4f39d694eda71938bfa5f23c995/G221/M0A/11/0F/HQ4DAF9xjx-AZv6jAEMDCpooYTQ954.mp3'
                }],
                isPlay:false,
                endTime:'',
                startTime:0,
                overTime:null,
                idx:0
            }
        },
       mounted(){
            //监听audio是否结束
            this.$refs.audio.addEventListener('ended',()=>{
                this.startTime=0
                clearInterval(this.overTime)
                this.isPlay=false
                this.$refs.yuandian.style.left=0+'%'
                this.$refs.cur.style.width=0+'%'
                if(this.idx===this.songInfo.length-1){
                    this.$refs.audio.autoPlay=false
                    this.reset()
                    this.onPlay()
                }else {
                   this.onNext()
                }
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
                    })
                }else {
                    this.$nextTick(() => {
                        this.$refs.audio.pause()
                        clearInterval(this.overTime)
                        this.isPlay=!this.isPlay
                    })

                }
            },
            //获取总时长
            updateTime(){
                this.$nextTick(() => {
                    this.endTime=this.$refs.audio.duration
                })
            },

            //定时器
            time(){
                this.$nextTick(() => {
                    this.overTime=setInterval(()=>{
                        // let loadTime=this.$refs.audio.buffered
                        // this.$refs.load.style.width=`${Math.floor(loadTime.end(loadTime.length-1)/parseInt(this.endTime)*100)}%`
                        this.startTime=this.$refs.audio.currentTime
                        this.point()
                        if(this.startTime>=this.endTime){
                            clearInterval(this.overTime)
                        }
                    },1000)
                })
            },
            //进度条
            point(){
                //得到进度条剩余百分比
                let leftWidth=(parseInt(this.startTime)/parseInt(this.endTime))*100;
                //进度条圆点
                this.$refs.yuandian.style.left=`${leftWidth}%`
                //进度条填充
                this.$refs.cur.style.width=`${leftWidth}%`
            },

            //下一曲
            onNext(){
                if(this.idx===this.songInfo.length-1){
                    return
                }
                this.idx+=1;
                this.reset()
            },
            //上一曲
            onPerv(){
                if(this.idx===0){
                    return
                }
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
                this.startTime=0;
                this.time()
            },
        },


        filters:{
            //歌曲时间转换
            dateTime(val){
                let hour=Math.floor(val/3600)+'';
                let min=Math.floor(val/60)%60+'';
                let second =val%60;
                let seconds=Math.round(second)+'';
                if(min>60){
                    return `${hour.padStart(2,'0')}:${min.padStart(2,'0')}:${seconds.padStart(2,'0')}`
                }else {
                    return `00:${min.padStart(2,'0')}:${seconds.padStart(2,'0')}`
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