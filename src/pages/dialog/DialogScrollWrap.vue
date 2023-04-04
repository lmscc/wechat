<template>
    <div class="pulldown" ref="scrollWrap">
        <div>
            <div class="topdiv">
                <div v-if="ifEnd" class="nomore">无更多消息</div>
                <img
                    v-else
                    class="loading"
                    src="../../assets/loading.gif"
                    alt=""
                />
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import { nextTick, onActivated, onMounted, ref } from "vue";
import store from "@/store";
const MAX_REST = 40;
export default {
    props: {
        onPullDown: Function,
        ifEnd: Boolean,
    },
    setup(props, { attrs }) {
        let y = 0;
        const scrollWrap = ref();
        store.state.keepBottom = function () {
            nextTick(() => {
                scrollWrap.value.scrollTo(0, Number.MAX_SAFE_INTEGER);
                
            });
            // setTimeout(()=>{
            //   scrollWrap.value.scrollTo(0,Number.MAX_SAFE_INTEGER)
            // })
        };
        onActivated(() => {
            scrollWrap.value.scrollTo(0, y);
            console.log("激活", y);
        });
        onMounted(() => {
            scrollWrap.value.addEventListener("scroll", () => {
                y = scrollWrap.value.scrollTop;
            });
            store.state.keepBottom();
            setTimeout(() => {
                let intersectionObserver = new IntersectionObserver(function (
                    entries
                ) {
                    // If intersectionRatio is 0, the target is out of view
                    // and we do not need to do anything.
                    if (entries[0].intersectionRatio <= 0) return;

                    console.log("Loaded new items");
                    let prevHeight = scrollWrap.value.scrollHeight;
                    // let prevTop = scrollWrap.scrollTop

                    function refresh() {
                        nextTick(() => {
                            y = scrollWrap.value.scrollHeight - prevHeight;
                            scrollWrap.value.scrollTo(0, y);
                        });
                    }
                    props.onPullDown(refresh);
                });
                intersectionObserver.observe(document.querySelector(".topdiv"));
                // start observing
            });
        });
        return {
            scrollWrap,
        };
    },
};
</script>

<style lang="stylus">
.pulldown {
    height: 100%;
    overflow: auto;

    .nomore {
        width: 100%;
        text-align: center;
        color: gray;
        padding-top: 10px;
        font-size: 15px;
    }
}
</style>