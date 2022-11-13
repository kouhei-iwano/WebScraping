function request(url){
  let reponse = UrlFetchApp.fetch(url)
  let content = reponse.getContentText()
  return content

}

function grab(){
  //Yahoo!知恵袋のページをリクエストし、レスポンスを実行ログに出力する
  let response = request("https://chiebukuro.yahoo.co.jp/category?fr=common-navi")
  console.log(response)

}

function scrape(){
  
  //シートの取得
  let spreadSheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadSheet.getSheetByName("シート1")
  
  //URL
  const URL_RENAI = "https://chiebukuro.yahoo.co.jp/category/2078675272/question/list"
  const URL_FAMILY = "https://chiebukuro.yahoo.co.jp/category/2078675273/question/list"
  const URL_NEIGHBOR = "https://chiebukuro.yahoo.co.jp/category/2079495801/question/list"
  const URL_FRIEND = "https://chiebukuro.yahoo.co.jp/category/2078675275/question/list"
  const URL_OFFICE = "https://chiebukuro.yahoo.co.jp/category/2078675274/question/list"
  const URL_SCHOOL = "https://chiebukuro.yahoo.co.jp/category/2080401676/question/list"

  //列タイトル出力
  sheet.clear()
  sheet.appendRow(["label", "text"])

  //カテゴリごとのQAリストを出力
  scrapeCategory(URL_RENAI, "恋愛相談", sheet)
  scrapeCategory(URL_FAMILY, "家族関係の悩み", sheet)
  scrapeCategory(URL_NEIGHBOR, "ご近所の悩み", sheet)
  scrapeCategory(URL_FRIEND, "友人関係の悩み", sheet)
  scrapeCategory(URL_OFFICE, "職場の悩み", sheet)
  scrapeCategory(URL_SCHOOL, "学校の悩み", sheet)

}

function scrapeCategory(listPageUrl, categoryName, sheet){

  //リストページから、質問IDを取得
  let qaIds = grabQaIds(listPageUrl)

  
  for(qaIndex in qaIds){

    //質問IDから、質問全文を取得
    let qaTitle = grabTitle(qaIds[qaIndex])

    //スプレッドシートに出力
    sheet.appendRow([categoryName, qaTitle])

  }

}

const YAHOO_QUESTION_URL = "https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/"

function grabTitle(qaId){

  //レスポンス取得
  let response = request(YAHOO_QUESTION_URL + qaId)

  //タイトルを抽出
  let qaTitle = Parser.data(response).from('<meta property="og:description" content="').to('" itemprop="description">').build()

  return qaTitle

}

function grabQaIds(listPageUrl){
  
  //レスポンス取得
  let response = request(listPageUrl)

  //質問IDの抽出
  let qaList = Parser.data(response).from('<section class="ClapLv3List_Chie-List__Section__6mPXC').to('</section>').build()
  let prefix = '<a href="' + YAHOO_QUESTION_URL
  let qaIds = Parser.data(qaList).from(prefix).to('" data-ylk').iterate()

  let array = []
  for (idIndex in qaIds){
    array.push(qaIds[idIndex])

  }

  return array

}








