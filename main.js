const width = 4
const height = 4
const size = 300 / 4


// 大文字にしておかないと，後でインスタンスとの区別がつかなくなって困る
// というか，panel という名前でインスタンスを宣言できなくなって不便
class Panel {
    constructor(x, y, value) {
        const div = document.createElement('div')
        this.div = div
        div.style.position = 'absolute'
        div.style.height = `${size}px`
        div.style.width = `${size}px`
        console.log(div);
        div.style.backgroundColor = '#8f8'
        // これじゃ t-kihira みたいなおもろいボーダーにならん
        //div.style.border = `3px ridge #000`
        div.style.border = `${size / 10}px ridge #484`
        div.style.boxSizing = 'border-box'
        // text が真ん中にこない，html のページで指定してるはずではあるが
        // 否，指定しているのは，下の矢印だけか
        div.style.fontSize = `${size / 4}px`
        // fontweight は初見の技術
        div.style.fontWeight = 'bold'
        // 普通に justify とか入れればいいだけの模様らしい
        div.style.justifyContent = 'center'
        div.style.alignItems = 'center'
        div.style.display = 'flex'
        // ダメだった，順番？
        // 単に更新されてないだけだった，そして，^ 三つ全てが必要な模様
        // justify を失くすと左にズレるし，display を無くすとそもそも両方効かなくなる

        // アニメーション設定ブロック
        // all と ease-out の意味がわからん，前は linear だったよな？？
        // transition を transform と間違っていた
        div.style.transition = 'all 150ms ease-out'
        div.style.transform = 'scale(0)'
        // これを指定しておくことにより，浮かび上がるみたいな動作をつくれるはず
        div.style.opacity = '0'

        container.appendChild(div)
        this.setPosition(x, y)
        this.setValue(value)
        // setTimeout の第一引数には，とにかく関数を突っ込めばいいと濃いことを覚えておこう
        // 今突っ込んでるのは， 引数なしの関数ということ，その場で定義している
        setTimeout(() => this.show(true), 50)
        // 動作チェック
        //setTimeout(() => this.setPosition(2,0), 1000)
    }

    // この flag はどこで設定するのというはなし
    show(flag) {
        console.log('flag', flag);
        this.div.style.transform = `scale(${flag ? 1 : 0})`
        this.div.style.opacity = `${flag ? 1 : 0}`
        console.log(this.div);
    }

    // constructor ないの関数定義は，普通の関数定義
    setPosition(x, y) {
        if (this.prevPanels) {
            for (const panel of this.prevPanels) {
                // すぐに消すんじゃなくて，こいつ自身の目的地に一緒に連れていきながら消すということをやってる
                // 天才か？
                // マジで，t-kihira 天才すぎて震えている
                panel.setPosition(x, y)
                setTimeout(() => panel.show(false), 150)

            }
        }
        // こんな大胆な変更をして，ぶっ壊れないのが謎
        if (this.x === x && this.y === y) {
            return false
        }
        this.x = x
        this.y = y
        // this を忘れるな！
        // constructor ないで呼び出す時も，this を介して動くということを覚えておこう
        this.div.style.top = `${size * y}px`
        this.div.style.left = `${size * x}px`

        return true
    }

    // 後から数字を変える可能性があるので，この辺は当然必要
    // クラスは直接値をいじりにいけないので，こういうのが必要になってくる
    // (こんな感じで組み立てるメリットが，若干見えてこない？関数を呼び出すので，直接いじるより何をやってるかはわかりやすいかも)
    // あとで色々機能を追加していくときにも，こんな感じで分離されてたら，再利用とかしやすいし，可読性も高いか
    // 自分の研究実装に関してはこういうこと全くやってないので，その威力を実感していきたい
    // つまるところ，機械学習フレームワークをつくろう (オブジェクト指向の価値をわかっていない)
    setValue(value) {
        this.value = value
        this.div.textContent = `${value}`
    }

    setPrevPanels(prevPanels) {
        // パネルが，足し算が複数個重なってきたときもこれで大丈夫なのかという感じはある
        this.prevPanels = prevPanels
    }
}

// まずは createNew パネパネをしていくという話
// その前に board の定義，論理実装する前には， ろんりぼーどをつくりましょう
// 今回は後から論理ボードを作っていく方針の模様
const createNewPanel = () => {
    const availableList = []
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // ここの判定方法がいまいちわからん，null にしたら，動かした後のもはどうなる？？
            // まあでもとりあえず，なんか要素があるかないかみたいな判定にしてるっぽい
            // そもそも，この board に何を入れるのかがはっきりしてない？数値だけだと思っとけばまあそれでいいか確かに
            if (!board[y][x]) {
                availableList.push([x, y])
            }
        }
    }
    const [x, y] = availableList[Math.trunc(Math.random() * availableList.length)]
    //board[y][x] = 2
    // パネパネを直接入れる模様，まあ確かにそれが妥当だよな，後からもいじりやすい
    board[y][x] = new Panel(x, y, 2)
}

// 動いたら，新しいパネパネを生成したい
const move = (direction) => {
    let isMove = false
    // 一旦実装の方針を見てみるスタイルで
    // そもそもどういう動きをしてくれたら嬉しいのかを考えながら確認しよう
    // オッケーまあ理解できた気はする

    // これ，height と width に分けるのは正方形なので不要
    // むしろややこしいので，そういうことはしない方がいい？まあでも，長方形型に拡張したくなったらすぐできるのは嬉しいけど，
    // その場合，ここのアルゴリズムをそれなりに書き換える必要があるかも？(意外とそのままいけるかも)

    // 全部上に行くエラーが発生
    // move に direction を渡し忘れてただけでした，クソが
    for (let index = 0; index < height; index++) {
        const bin = []
        for (let pos = 0; pos < width; pos++) {
            if (direction === 'left' || direction === 'right') {
                bin[pos] = board[index][pos]
            } else {
                bin[pos] = board[pos][index]
            }
        }
        // これやっぱりいらんよね
        // ごめんなさい必要です
        // これを抜くと，down, right の時に入れ替わりが発生してしまいます
        // わかった，仕様の勘違いをしていた，これは順番を並び替えずに移動したいので，
        // 二回裏返して元に戻す必要があるんだ
        // filter は端っこに寄せる処理，端っこに寄せたら，相対関係の変化は不可能なのでという話？？
        // ちょっとこれはかなり難しい話になってくる，回転群とか勉強したらわかるのかな？？
        // 相対移動と，回転の順番的な話を突き詰めなければならない気がして，今パッとした回答は出てこない
        // とりあえず，並行移動と回転の順序について今後調べよう，と覚えておけばOKだ(別に線形代数でも十分かも)
        // 射影幾何とかも，アフィン幾何とかも一度きちんとやりたい，と覚えておこう
        if (direction === 'down' || direction === 'right') {
            bin.reverse()
        }

        let result = bin.filter(v => !!v)
        for (let pos = 0; pos < 4; pos++) {
            const current = result[pos]
            const next = result[pos + 1]
            if (current && next && current.value == next.value) {
                current.show(false)
                next.show(false)
                // ここで，result をいじりにいくのか，current をいじるのかで悩む時点でアホ
                // だが，そういうのをリアルタイムで考えていけるようになりたい, 今のままだと LLM とやってること変わらん猿真似だよ
                // pos はどうせ後で指定されるので，適当に指定，むしろ変な値入れる方が嫌か
                const panel = new Panel(-1, -1, current.value + next.value)
                // ここの動作がよくわかってない，動作というか，新しい panel に前のパネルを追加するのがよくわからん？?
                // とかちょっっと思ってたけど，新しく生成したパネルが，元あったパネルの消去まで面倒見るという考え方なら，むしろ納得がいくような気がする
                // 流石 t-kihira だ.
                panel.setPrevPanels([current, next])
                result[pos] = panel
                result[pos + 1] = null
            }
        }
        result = result.filter(v => !!v)
        result.length = 4

        // この辺を入れなかったら，left/right で場合分けが必要になってめんどくさい
        // ごめんそんなことなかった
        // いやごめんやっぱ必要だわ，なんか入れ替わってしまうわ
        if (direction === 'down' || direction === 'right') {
            result.reverse()
        }
        // これで undefined じゃなくて null が詰められるのがよくわからん
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/length ここに null が埋められるしようが載っている

        for (let pos = 0; pos < width; pos++) {
            if (direction === 'left' || direction === 'right') {
                board[index][pos] = result[pos]
                if (result[pos]) {
                    // この書き方超オシャレなんだけど，一般的？？
                    // 何を食ったらこんな書き方を思いつく？？
                    isMove = result[pos].setPosition(pos, index) || isMove
                }
            } else {
                board[pos][index] = result[pos]
                if (result[pos]) {
                    isMove = result[pos].setPosition(index, pos) || isMove
                }
            }
        }
    }
    if (isMove) {
        createNewPanel()
    }
}

// いつも思うが，配列の初期化は，後から append する場合でも const でいいみたい？
// そもそも，let と const のコンパイラというか，言語としての設計方法が気になるかも
const board = []
const init = () => {
    // 普段とは違う，html からの代入になった途端，戸惑ってしまうナメクジ
    const container = document.getElementById('container')
    for (let y = 0; y < height; y++) {
        board[y] = []
        for (let x = 0; x < width; x++) {
            board[y][x] = null
            // const つけ忘れ（1敗）
            // const をつけていなかったら，style の後ろの予測が出ないので，今後はそこで気づけばいい
            const div = document.createElement('div')
            div.style.position = 'absolute'
            // px つけ忘れ（1敗）
            div.style.height = `${size}px`
            div.style.width = `${size}px`
            div.style.top = `${size * y}px`
            div.style.left = `${size * x}px`
            console.log(div);
            div.style.backgroundColor = '#fcc'
            div.style.border = `${size / 40}px ridge #844`
            div.style.boxSizing = 'border-box'
            container.appendChild(div)
        }
    }
    // 次は各数字が入ったマスの召喚が必要
    // createCell みたいな名前でいいんだろうか
    // 模倣じゃなくて，全く新しいゲームを作る時は，全くあたらしい実装が必要なはず
    //new Panel(2, 2, 2048)
    // こんな感じに，論文にもコメントを入れていけたらなかなかいいんじゃないかと思うんだけど
    // まあフォーマットの問題とかで難しそうではあるが，HTML 版とかを使えば，全然できないこともないようにおもえる
    // （HTML に対応してない時代のやつは厳しく，そもそも HTML に変換するツールから必要になってくるな）

    createNewPanel()
    createNewPanel()

    // ここの定義の仕方，普通にスマートすぎて素晴らしいです
    // 一旦ここで区切って実装してるけど，鳥頭なので
    // できれば一気に実装できるくらいの実力が欲しい
    // まあでも，init の中に入れるよね，という常識がついてるのはいいことだと思う
    const idList = ['left', 'up', 'down', 'right']
    for (const id of idList) {
        document.getElementById(id).onpointerdown = (e) => {
            e.preventDefault();
            console.log(id);
            move(id)
        }
    }

    // addEventlisner と hoge.pointerdown の違いは，元から用意されてるかされてないかの違いだろうか
    document.addEventListener('keydown', function (e) {
        //console.log(e.key.toLowerCase().slice(5));
        move(e.key.toLowerCase().slice(5))

        /*
        switch (e.key) {
            case 'ArrowUp':
                move('up')
                break;
            case 'ArrowDown':
                move('down')
                break;
            case 'ArrowLeft':
                move('left')
                break;
            case 'ArrowRight':
                move('right')
                break;
            default:
                break;
        }
        */
        // こんなだせえコード必要ない
    });
}


window.onload = () => {
    init()
}