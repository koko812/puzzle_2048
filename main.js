const width = 4
const height = 4
const size = 300 / 4


class panel {
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
        this.x = x
        this.y = y
        // this を忘れるな！
        // constructor ないで呼び出す時も，this を介して動くということを覚えておこう
        this.div.style.top = `${size * y}px`
        this.div.style.left = `${size * x}px`
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
    board[y][x] = new panel(x, y, 2)
}

const move = (direction) => {
    // 一旦実装の方針を見てみるスタイルで
    // そもそもどういう動きをしてくれたら嬉しいのかを考えながら確認しよう
    // オッケーまあ理解できた気はする

    // これ，height と width に分けるのは正方形なので不要
    // むしろややこしいので，そういうことはしない方がいい？まあでも，長方形型に拡張したくなったらすぐできるのは嬉しいけど，
    // その場合，ここのアルゴリズムをそれなりに書き換える必要があるかも？(意外とそのままいけるかも)

    // 全部上に行くエラーが発生
    for (let index = 0; index < height; index++) {
        const bin = []
        for (let pos = 0; pos < width; pos++) {
            if (direction === 'left' || direction === 'right') {
                bin[pos] = board[index][pos]
            } else {
                bin[pos] = board[pos][index]
            }
        }
        console.log('binbefore: ',bin);
        if (direction === 'down' || direction === 'right') {
            console.log('reverse');
            bin.reverse()
        }

        result = bin.filter(v => !!v)
        result.length = 4

        for(let i = 0; i < result.length; i++){
            if(!result[i]){
                result[i] = false 
            }
        }
        console.log('before: ',bin, result);
        if (direction === 'down' || direction === 'right') {
            result.reverse()
        }
        // これで undefined じゃなくて null が詰められるのがよくわからん
        // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/length ここに null が埋められるしようが載っている

        console.log('after: ', bin, result);
        for (let pos = 0; pos < width; pos++) {
            if (direction === 'left' || direction === 'right') {
                board[index][pos] = result[pos]
                if (result[pos]) {
                    result[pos].setPosition(pos, index)
                }
            } else {
                board[pos][index] = result[pos]
                if (result[pos]) {
                    result[pos].setPosition(index, pos)
                }
            }
        }
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
    //new panel(2, 2, 2048)
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
}


window.onload = () => {
    init()
}