<template>
    <div class="main-page">
        <div class="top-bar">
            <p class="music-name">{{songInfo[0].name}}</p>
            <p class="author">- {{songInfo[0].artistsName}} -</p>
        </div>
        <div class="background-filter" :style='`background-image:url(${songInfo[0].cover})`'></div>
        <swiper :cover="songInfo[0]" :is-play="isPlay"></swiper>
        <div class="music">
            <audio src="https://music.163.com/song/media/outer/url?id=1466598056.mp3"
                   type="audio/mp3"
                   ref="audio"
                   @canplay="updateTime"
            ></audio>
            <div class="music-time">
                <div class="start-time time">{{startTime|dateTime}}</div>
                <div class="progress-bar">
                    <div class="load-bar"></div>
                    <div class="point-bar"></div>
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
                <div class="audio-style" >
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
                }],
                isPlay:false,
                endTime:0,
                startTime:0,
                overTime:null
            }
        },
        methods:{
            //播放暂停
            onPlay(){
                if(!this.isPlay){
                    this.$refs.audio.play()
                    this.isPlay=!this.isPlay
                    this.time()
                }else {
                    this.$refs.audio.pause()
                    clearInterval(this.overTime)
                    this.isPlay=!this.isPlay
                }
            },
            //获取总时长
            updateTime(){
                this.endTime=this.$refs.audio.duration
            },

            time(){
             this.overTime=setInterval(()=>{
                    this.startTime+=1;
                    if(this.startTime>=this.endTime){
                        clearInterval(this.overTime)
                    }
                },1000)
            }
        },
        filters:{
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
            bottom: 0.3rem;
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
                    height: 0.2rem;
                    background: #f3e7e7;
                    border-radius: 4px;
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