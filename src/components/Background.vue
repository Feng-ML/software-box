<template>
    <div class="background">
        <div class="jumbo"></div>
    </div>
</template>

<script lang='ts' setup>
</script>

<style lang="scss" scoped>
.background {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
}

@keyframes jumbo {
    from {
        background-position: 50% 50%, 50% 50%;
    }

    to {
        background-position: 350% 50%, 350% 50%;
    }
}

.jumbo {
    inset: 0px;
    position: absolute;
    opacity: 0.5;
    --stripes: repeating-linear-gradient(100deg,
            #fff 0%,
            #fff 7%,
            transparent 10%,
            transparent 12%,
            #fff 16%);
    --stripesDark: repeating-linear-gradient(100deg,
            #000 0%,
            #000 7%,
            transparent 10%,
            transparent 12%,
            #000 16%);
    --rainbow: repeating-linear-gradient(100deg,
            #60a5fa 10%,
            #e879f9 15%,
            #60a5fa 20%,
            #5eead4 25%,
            #60a5fa 30%);
    background-image: var(--stripes), var(--rainbow);
    background-size: 300%, 200%;
    background-position: 50% 50%, 50% 50%;

    filter: blur(10px) invert(100%);

    mask-image: radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%);

    pointer-events: none;
}

.jumbo::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: var(--stripes), var(--rainbow);
    background-size: 200%, 100%;
    animation: jumbo 60s linear infinite;
    background-attachment: fixed;
    mix-blend-mode: difference;
}

[data-theme='dark'] .background {
    background-color: #000;
}

[data-theme='dark'] .jumbo {
    background-image: var(--stripesDark), var(--rainbow);
    filter: blur(10px) opacity(50%) saturate(200%);
}

[data-theme='dark'] .jumbo::after {
    background-image: var(--stripesDark), var(--rainbow);
}
</style>