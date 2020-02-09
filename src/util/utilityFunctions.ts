export function wait(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export function isMobile() {
    return window.innerWidth < 600;
}

export function hslInterval(color1: string, color2: string, weight: number) {
    const [h1, s1, l1] = color1.split(',')
        .map(value =>
            Number([].filter.call(value, s => !isNaN(s)).join(''))
        );
    const [h2, s2, l2] = color2.split(',')
        .map(value =>
            Number([].filter.call(value, s => !isNaN(s)).join(''))
        );

    // difference * weight
    const [h_toAdd, s_toAdd, l_toAdd] = [
        Math.abs(h1-h2) * weight,
        Math.abs(s1-s2) * weight,
        Math.abs(l1-l2) * weight,
    ];

    const [h_new, s_new, l_new] = [
        h1 < h2 ? h1 + h_toAdd : h1 - h_toAdd,
        s1 < s2 ? s1 + s_toAdd : s1 - s_toAdd,
        l1 < l2 ? l1 + l_toAdd : l1 - l_toAdd,
    ];

    return `hsl(${h_new}, ${s_new}%, ${l_new}%)`;
}
