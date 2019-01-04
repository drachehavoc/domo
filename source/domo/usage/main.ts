import { template, domo, css, attr, text, evnt, data } from "../syntax.js";
import { DomoElement } from "../DomoElement.js";

let y = {
    ancora: <DomoElement>null!,
    texto: <Text>null!
}

let x = template(
    css`
        div {
            color: red
        }

        img {
            width: 20px
        }
    `,
    domo`div`(),
    domo`div`(
        domo`img`(
            attr`src``https://i.pinimg.com/originals/0b/35/ba/0b35bae27c1d8af89e96e61d729a93b5.jpg`,
            evnt`load``${console.dir}`
        )
    ),
    domo`div`(),
    y.ancora =
    domo`div`(
        attr`class``100`,
        attr`name``asds`,
        attr`id``nome`,
        data`xxx``asds`,
        data`xxx``asds`,
        text`teste`,
        domo`span`(
            evnt`click``${e => console.log(e.target)} ${false}`,
            y.texto =
            text`aaaaaaaaaa`
        )
    )
)

setTimeout(() => {
    document.body.appendChild(x.content)
    let yc = y.ancora.cloneNode().raw
    document.body.appendChild(yc)
    y.texto.textContent = 'MUDEI'
    console.dir(y)
})//, 3000)