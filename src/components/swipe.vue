<template>
    <div>
        <swiper  ref="mySwiper">
            <swiper-slide>
                <div class="disc-cover" :class="{'play-ani':isPlay}">
                    <div class="disc" ref="rotate">
                        <img :src="this.cover.cover" alt="">
                    </div>
                </div>
            </swiper-slide>
            <swiper-slide></swiper-slide>
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

            }
        },
        computed:{

    },
        methods:{

        },

    }
</script>

<style lang="scss"  scoped>
    .swiper-slide{
        width: 100%;
        height: 6.5rem;
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
               animation: play 12s infinite linear forwards;
               box-shadow: 0 0 0 0.2rem rgba(15, 9, 9, 0.64);
               animation-play-state: paused;
               img{
                   width: 100%;
                   height: 100%;
               }
           }
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