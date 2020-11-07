<template>
    <div>
        <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide>
                <div class="disc-cover" :class="{'play-ani':isPlay}">
                    <div class="disc">
                        <img :src="this.cover.cover" alt="">
                    </div>
                </div>
            </swiper-slide>
            <swiper-slide>

            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
    import { Swiper, SwiperSlide} from 'vue-awesome-swiper'
    import 'swiper/swiper-bundle.css'

    export default {
        name: "swipe",
        props:['cover','isPlay'],
        components:{
            Swiper,
            SwiperSlide
        },
        data(){
            return{
                swiperOptions:{
                    autoplay:false,
                },
            }
        },
        computed:{

    },
        methods:{

        },
        mounted(){

        }

    }
</script>

<style lang="scss"  scoped>
    .swiper-slide{
        width: 100%;
        .disc-cover{
            width: 100%;
            margin-top: 1rem;
           .disc{
               width: 5rem;
               height: 5rem;
               border-radius: 50%;
               overflow: hidden;
                margin: 0 auto;
               box-sizing: border-box;
               border: 0.23rem solid #bdb4b4;
               img{
                   width: 100%;
                   height: 100%;
               }
           }
        }
        .play-ani{
            animation: play 5s infinite linear;
        }
        @keyframes play {
            from{
                transform: rotate(0);
            }
            to{
                transform: rotate(360deg);
            }
        }
    }
</style>