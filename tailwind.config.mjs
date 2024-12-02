import defaultTheme from 'tailwindcss/defaultTheme'

export default {
    content: ['./projects/traknapp/src/**/*.{html,ts}'],
    theme: {
        fontFamily: {
            sans: ['"NunitoSans"', ...defaultTheme.fontFamily.sans],
            icon: ['"remixicon"'],
        },
    },
}
