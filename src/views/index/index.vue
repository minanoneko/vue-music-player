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
                    <div class="load-bar"></div>
                    <div class="point-bar" ref="yuandian"></div>
                </div>
                <div class="end-time time">{{endTime|dateTime}}</div>
            </div>
            <div class="music-btn">
                <div class="audio-style" >
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
                    artistsName:'米津玄師&daoko',
                    cover:'https://p2.music.126.net/ZUCE_1Tl_hkbtamKmSNXEg==/109951163009282836.jpg',
                    name:'打上花火',
                    url:'https://win-web-nf01-sycdn.kuwo.cn/857364c6269d1265ec40cf196c494f39/5fa6e342/resource/n1/55/56/394740245.mp3'
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

            },

            //下一曲，有BUG待修复。
            onNext(){
                if(this.idx===this.songInfo.length-1){
                    return
                }
                this.idx+=1;
                this.$nextTick(()=>{
                    this.$refs.audio.load();
                    this.$refs.audio.autoplay=true
                })
                this.isPlay=true
                this.startTime=0;
                clearInterval(this.overTime)
                this.time()
            }
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
        height: 100vh;
        position: relative;
        .top-bar{
            width: 100%;
            height: 1.2rem;
            text-align: center;
            color: #ffff;
            line-height: 0.6rem;
            .author{
                font-size: 0.3rem;
            }
            .music-name{
                font-weight: 500;
                font-size: 0.5rem;
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
            filter: blur(0.15rem);
            opacity: 0.7;
            overflow: hidden;
            box-sizing: border-box;
            background-repeat: no-repeat;
        }
        .music{
            position: fixed;
            bottom: 0.5rem;
            width: 100%;
            height: 1rem;
            .music-time{
                width: 100%;
                display: flex;
                justify-content: space-around;
                position: absolute;
                bottom: 2rem;
                align-items: center;
                .time{
                    font-size: 0.32rem;
                    color: #f8f8f8;
                }
                .progress-bar{
                    width: 3.7rem;
                    height: 0.1rem;
                    background: #f3e7e7;
                    border-radius: 4px;
                    position: relative;
                    .load-bar{

                    }
                    .point-bar{
                        width: 0.33rem;
                        height: 0.33rem;
                        position: absolute;
                        left: 0;
                        top:50%;
                        z-index: 999;
                        background: rgba(201, 191, 191, 0.99);
                        border-radius: 50%;
                        transform: translateY(-50%);
                    }

                }
            }
            .music-btn{
                display: flex;
                justify-content: space-around;
                align-items: center;
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