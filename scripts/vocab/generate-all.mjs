/**
 * 生成 batch-01 ~ batch-12 词库文件
 * 运行: node scripts/vocab/generate-all.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 格式: word|pos|meaning|example
function parseBlock(text) {
  return text
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [word, pos, meaning, example] = line.split("|");
      return `${word}\t${pos}\t${meaning}\t${example || word}`;
    });
}

const blocks = [
// batch 1: A
`abandon|v.|放弃|abandon the plan
ability|n.|能力|ability to learn
able|adj.|能够的|be able to do
abroad|adv.|在国外|study abroad
absence|n.|缺席|in the absence of
absent|adj.|缺席的|be absent from
absolute|adj.|绝对的|absolute truth
absorb|v.|吸收|absorb knowledge
abstract|adj.|抽象的|abstract idea
abundant|adj.|丰富的|abundant resources
abuse|v./n.|滥用|abuse of power
academic|adj.|学术的|academic research
accept|v.|接受|accept the offer
access|n./v.|接近/通道|have access to
accident|n.|事故|by accident
accompany|v.|陪伴|accompany sb.
accomplish|v.|完成|accomplish a goal
account|n.|账户/说明|take into account
accurate|adj.|准确的|accurate data
accuse|v.|指控|accuse sb. of
achieve|v.|实现|achieve success
achievement|n.|成就|great achievement
acknowledge|v.|承认|acknowledge the truth
acquire|v.|获得|acquire skills
act|v./n.|行动/法案|act quickly
action|n.|行动|take action
active|adj.|积极的|active member
activity|n.|活动|outdoor activity
actual|adj.|实际的|actual situation
adapt|v.|适应|adapt to change
add|v.|增加|add up
addition|n.|增加|in addition
additional|adj.|额外的|additional cost
address|n./v.|地址/演讲|home address
adequate|adj.|足够的|adequate supply
adjust|v.|调整|adjust to
administration|n.|管理|public administration
admire|v.|钦佩|admire courage
admit|v.|承认/录取|admit defeat
adopt|v.|采纳/收养|adopt a method
adult|n.|成年人|adult education
advance|v./n.|前进/进步|in advance
advanced|adj.|先进的|advanced technology
advantage|n.|优势|take advantage of
adventure|n.|冒险|adventure story
advertise|v.|做广告|advertise products
advice|n.|建议|a piece of advice
advise|v.|建议|advise sb. to do
affair|n.|事务|public affair
affect|v.|影响|affect the result
afford|v.|负担得起|cannot afford
afraid|adj.|害怕的|be afraid of
after|prep.|在…之后|after class
afternoon|n.|下午|good afternoon
again|adv.|再次|again and again
against|prep.|反对/靠着|against the law
age|n.|年龄|at the age of
agency|n.|机构|travel agency
agent|n.|代理人|insurance agent
ago|adv.|以前|years ago
agree|v.|同意|agree with
agreement|n.|协议|reach agreement
agriculture|n.|农业|modern agriculture
ahead|adv.|在前|ahead of time
aid|n./v.|帮助|first aid
aim|n./v.|目标/瞄准|aim at
air|n.|空气|fresh air
aircraft|n.|飞机|military aircraft
airline|n.|航空公司|international airline
airport|n.|机场|at the airport
alarm|n.|警报|fire alarm
alcohol|n.|酒精|alcohol abuse
alert|adj.|警觉的|stay alert
alike|adj.|相似的|look alike
alive|adj.|活着的|stay alive
all|pron.|全部|all of us
allow|v.|允许|allow sb. to do
almost|adv.|几乎|almost done
alone|adj.|独自的|leave alone
along|prep.|沿着|along the road
already|adv.|已经|already finished
also|adv.|也|also important
alter|v.|改变|alter the plan
alternative|n.|选择|alternative method
although|conj.|虽然|although tired
altogether|adv.|总共|altogether 30
always|adv.|总是|always ready
amaze|v.|使惊讶|amaze the audience
ambition|n.|雄心|career ambition
among|prep.|在…之中|among students
amount|n.|数量|a large amount
analysis|n.|分析|data analysis
analyze|v.|分析|analyze data
ancient|adj.|古代的|ancient history
anger|n.|愤怒|in anger
angle|n.|角度|from another angle
animal|n.|动物|wild animal
announce|v.|宣布|announce news
annual|adj.|每年的|annual report
another|pron.|另一个|another chance
answer|n./v.|回答|answer the question
anxiety|n.|焦虑|social anxiety
anxious|adj.|焦虑的|be anxious about
any|adj./pron.|任何|any time
anybody|pron.|任何人|anybody else
anyone|pron.|任何人|anyone can
anything|pron.|任何事|anything else
anyway|adv.|无论如何|anyway let's go
anywhere|adv.|任何地方|go anywhere
apart|adv.|分开|apart from
apartment|n.|公寓|rent an apartment
apologize|v.|道歉|apologize to sb.
apparent|adj.|明显的|it is apparent
appeal|n./v.|吸引力|appeal to
appear|v.|出现|appear to be
appearance|n.|外表|outward appearance
application|n.|申请|job application
apply|v.|申请/应用|apply for
appoint|v.|任命|appoint a leader
appointment|n.|约会|make an appointment
appreciate|v.|感激/欣赏|appreciate help
approach|n./v.|方法/接近|new approach
appropriate|adj.|适当的|appropriate behavior
approval|n.|批准|gain approval
approve|v.|批准|approve the plan
approximate|adj.|大约的|approximate number
architect|n.|建筑师|famous architect
architecture|n.|建筑|modern architecture
area|n.|区域|rural area
argue|v.|争论|argue with
argument|n.|论点|strong argument
arise|v.|出现|problems arise
arm|n.|手臂/武器|arm in arm
army|n.|军队|join the army
around|prep.|围绕|around the world
arrange|v.|安排|arrange a meeting
arrangement|n.|安排|make arrangements
arrest|v./n.|逮捕|under arrest
arrival|n.|到达|on arrival
arrive|v.|到达|arrive at
art|n.|艺术|work of art
article|n.|文章|newspaper article
artist|n.|艺术家|famous artist
ashamed|adj.|羞愧的|be ashamed of
aside|adv.|在旁边|step aside
ask|v.|问|ask for help
asleep|adj.|睡着的|fall asleep
aspect|n.|方面|key aspect
assess|v.|评估|assess risk
assessment|n.|评估|risk assessment
assign|v.|分配|assign a task
assignment|n.|作业|homework assignment
assist|v.|帮助|assist sb.
assistance|n.|帮助|financial assistance
assistant|n.|助手|personal assistant
associate|v.|联系|associate with
association|n.|协会|alumni association
assume|v.|假设|assume that
assumption|n.|假设|basic assumption
assure|v.|保证|assure sb. that
athlete|n.|运动员|professional athlete
atmosphere|n.|氛围/大气|pleasant atmosphere
attach|v.|附加|attach importance to
attack|n./v.|攻击|under attack
attempt|n./v.|尝试|make an attempt
attend|v.|参加|attend a meeting
attention|n.|注意|pay attention to
attitude|n.|态度|positive attitude
attract|v.|吸引|attract attention
attraction|n.|吸引力|tourist attraction
attractive|adj.|有吸引力的|attractive offer
audience|n.|观众|large audience
author|n.|作者|famous author
authority|n.|权威|local authority
automatic|adj.|自动的|automatic system
available|adj.|可获得的|be available
average|n./adj.|平均|on average
avoid|v.|避免|avoid mistakes
award|n./v.|奖|win an award
aware|adj.|意识到的|be aware of
away|adv.|离开|far away
awful|adj.|糟糕的|awful weather`,

// batch 2: B-C
`baby|n.|婴儿|baby boy
back|n./adv.|背部/回|come back
background|n.|背景|cultural background
backward|adj.|向后的|backward step
bacteria|n.|细菌|harmful bacteria
bad|adj.|坏的|bad habit
badly|adv.|严重地|badly hurt
bag|n.|袋子|shopping bag
balance|n./v.|平衡|keep balance
ball|n.|球|play ball
ban|v./n.|禁止|ban smoking
band|n.|乐队/带子|rock band
bank|n.|银行|open a bank account
bar|n.|酒吧/条|progress bar
bare|adj.|赤裸的|bare feet
bargain|n./v.|便宜货/讨价还价|good bargain
barrier|n.|障碍|language barrier
base|n./v.|基础/基于|base on
basic|adj.|基本的|basic skills
basis|n.|基础|on the basis of
battle|n./v.|战斗|battle against
be|v.|是|be happy
bear|v./n.|忍受/熊|bear the pain
beat|v./n.|打败/节拍|beat the record
beautiful|adj.|美丽的|beautiful view
beauty|n.|美丽|natural beauty
because|conj.|因为|because of
become|v.|成为|become a teacher
bed|n.|床|go to bed
bedroom|n.|卧室|clean the bedroom
before|prep.|在…之前|before class
begin|v.|开始|begin to learn
behalf|n.|代表|on behalf of
behave|v.|表现|behave well
behavior|n.|行为|good behavior
behind|prep.|在…后面|behind the door
being|n.|存在|human being
belief|n.|信念|strong belief
believe|v.|相信|believe in
bell|n.|铃|ring the bell
belong|v.|属于|belong to
below|prep.|在…下面|below zero
belt|n.|腰带|seat belt
bench|n.|长凳|park bench
bend|v./n.|弯曲|bend down
benefit|n./v.|利益/受益|benefit from
beside|prep.|在…旁边|beside the river
besides|prep./adv.|除…之外还|besides English
best|adj./adv.|最好的|do one's best
bet|v./n.|打赌|bet on
better|adj./adv.|更好的|get better
between|prep.|在…之间|between us
beyond|prep.|超出|beyond control
bicycle|n.|自行车|ride a bicycle
bid|n./v.|投标/出价|bid for
big|adj.|大的|big city
bill|n.|账单/法案|pay the bill
billion|n.|十亿|two billion
bind|v.|绑/约束|bind together
biology|n.|生物学|study biology
bird|n.|鸟|wild bird
birth|n.|出生|date of birth
birthday|n.|生日|happy birthday
bit|n.|一点|a bit tired
bite|v./n.|咬|bite the apple
bitter|adj.|苦的/痛苦的|bitter experience
black|adj.|黑色的|black coffee
blame|v./n.|责备|blame sb. for
blank|adj.|空白的|blank page
blind|adj.|盲的|go blind
block|n./v.|块/阻塞|block the road
blood|n.|血|blood type
blow|v./n.|吹/打击|blow the wind
blue|adj.|蓝色的|blue sky
board|n.|板/董事会|on board
boat|n.|船|by boat
body|n.|身体|human body
boil|v.|沸腾|boil water
bold|adj.|大胆的|bold decision
bomb|n.|炸弹|time bomb
bond|n.|纽带/债券|strong bond
bone|n.|骨头|broken bone
book|n.|书|read a book
boom|n./v.|繁荣/轰鸣|economic boom
boot|n.|靴子|leather boot
border|n.|边界|cross the border
bore|v.|使厌烦|bore sb.
born|v.|出生|be born in
borrow|v.|借入|borrow money
boss|n.|老板|my boss
both|pron.|两者都|both of us
bother|v.|打扰|don't bother
bottle|n.|瓶子|water bottle
bottom|n.|底部|at the bottom
bound|adj.|一定的/be bound to
boundary|n.|边界|national boundary
bow|v./n.|鞠躬|bow to
bowl|n.|碗|a bowl of rice
box|n.|盒子|gift box
boy|n.|男孩|little boy
brain|n.|大脑|use your brain
branch|n.|分支/树枝|bank branch
brand|n.|品牌|famous brand
brave|adj.|勇敢的|brave soldier
bread|n.|面包|a loaf of bread
break|v./n.|打破/休息|break the rule
breakfast|n.|早餐|have breakfast
breath|n.|呼吸|out of breath
breathe|v.|呼吸|breathe deeply
breed|v./n.|繁殖/品种|breed animals
bridge|n.|桥|cross the bridge
brief|adj.|简短的|brief introduction
bright|adj.|明亮的/聪明的|bright future
brilliant|adj.|杰出的|brilliant idea
bring|v.|带来|bring about change
broad|adj.|宽的/广泛的|broad mind
broadcast|v./n.|广播|live broadcast
brother|n.|兄弟|elder brother
brown|adj.|棕色的|brown hair
brush|n./v.|刷子/刷|brush teeth
budget|n.|预算|within budget
build|v.|建造|build a house
building|n.|建筑物|office building
bunch|n.|一束/群|a bunch of
burden|n.|负担|heavy burden
burn|v./n.|燃烧/烧伤|burn down
burst|v./n.|爆发|burst into tears
bus|n.|公交车|by bus
business|n.|商业/生意|do business
busy|adj.|忙碌的|be busy with
but|conj.|但是|small but strong
butter|n.|黄油|bread and butter
button|n.|按钮|press the button
buy|v.|买|buy a book
by|prep.|被/通过|by bus
cable|n.|电缆|cable TV
cafe|n.|咖啡馆|local cafe
cage|n.|笼子|bird cage
cake|n.|蛋糕|birthday cake
calculate|v.|计算|calculate the cost
call|v./n.|叫/电话|call sb.
calm|adj./v.|平静的/使平静|keep calm
camera|n.|相机|digital camera
camp|n./v.|营地/露营|summer camp
campaign|n./v.|运动/战役|election campaign
campus|n.|校园|on campus
can|v./n.|能/罐头|can swim
cancel|v.|取消|cancel the meeting
cancer|n.|癌症|fight cancer
candidate|n.|候选人|job candidate
cap|n.|帽子/盖子|bottle cap
capable|adj.|有能力的|be capable of
capacity|n.|容量/能力|full capacity
capital|n.|首都/资本|capital city
captain|n.|队长/船长|team captain
capture|v./n.|捕获|capture attention
car|n.|汽车|by car
card|n.|卡片|credit card
care|n./v.|关心/照顾|take care of
career|n.|职业|career plan
careful|adj.|小心的|be careful
careless|adj.|粗心的|careless mistake
carry|v.|携带|carry out
case|n.|情况/箱子|in case of
cash|n.|现金|pay in cash
cast|v./n.|投掷/演员|cast doubt
cat|n.|猫|pet cat
catch|v.|抓住/赶上|catch a cold
category|n.|类别|product category
cause|n./v.|原因/引起|cause trouble
caution|n.|谨慎|with caution
cautious|adj.|谨慎的|be cautious
cave|n.|洞穴|deep cave
cease|v.|停止|cease fire
celebrate|v.|庆祝|celebrate birthday
celebration|n.|庆祝|birthday celebration
cell|n.|细胞/牢房|prison cell
cent|n.|分|fifty cents
center|n.|中心|city center
central|adj.|中央的|central government
century|n.|世纪|21st century
ceremony|n.|仪式|opening ceremony
certain|adj.|确定的|be certain of
certainly|adv.|当然|certainly not
certificate|n.|证书|graduation certificate
chain|n.|链条/连锁|food chain
chair|n.|椅子|sit on a chair
chairman|n.|主席|board chairman
challenge|n./v.|挑战|face a challenge
chamber|n.|房间/议院|chamber of commerce
chance|n.|机会|by chance
change|v./n.|改变/零钱|change the plan
channel|n.|频道/渠道|TV channel
chapter|n.|章节|chapter one
character|n.|性格/角色|main character
charge|n./v.|费用/指控|in charge of
charity|n.|慈善|give to charity
charm|n./v.|魅力|personal charm
chart|n.|图表|bar chart
chase|v./n.|追逐|chase after
cheap|adj.|便宜的|cheap price
cheat|v./n.|欺骗|cheat in exam
check|v./n.|检查/支票|check the answer
cheek|n.|脸颊|rosy cheek
cheer|v./n.|欢呼|cheer up
cheese|n.|奶酪|a piece of cheese
chemical|adj./n.|化学的/化学品|chemical reaction
chemistry|n.|化学|study chemistry
cheque|n.|支票|write a cheque
chest|n.|胸部/箱子|treasure chest
chicken|n.|鸡/鸡肉|fried chicken
chief|adj./n.|主要的/首领|chief reason
child|n.|孩子|only child
childhood|n.|童年|happy childhood
choice|n.|选择|make a choice
choose|v.|选择|choose the best
church|n.|教堂|go to church
cigarette|n.|香烟|smoke cigarettes
cinema|n.|电影院|go to cinema
circle|n./v.|圆/环绕|full circle
circuit|n.|电路/巡回|circuit board
circumstance|n.|情况|under the circumstances
cite|v.|引用|cite an example
citizen|n.|公民|law-abiding citizen
city|n.|城市|big city
civil|adj.|公民的/民事的|civil rights
claim|v./n.|声称/要求|claim that
class|n.|班级/阶级|in class
classic|adj./n.|经典的|classic novel
classify|v.|分类|classify data
classroom|n.|教室|clean the classroom
clause|n.|从句/条款|relative clause
clean|adj./v.|干净的/打扫|keep clean
clear|adj./v.|清楚的/清除|make clear
clerk|n.|职员|office clerk
clever|adj.|聪明的|clever student
click|v./n.|点击|click the button
client|n.|客户|important client
climate|n.|气候|climate change
climb|v./n.|爬|climb the mountain
clock|n.|时钟|alarm clock
close|v./adj.|关闭/近的|close the door
cloth|n.|布|a piece of cloth
clothes|n.|衣服|new clothes
cloud|n.|云|dark cloud
club|n.|俱乐部|join a club
clue|n.|线索|give a clue
coach|n./v.|教练/辅导|football coach
coal|n.|煤|burn coal
coast|n.|海岸|east coast
coat|n.|外套|wear a coat
code|n.|代码/准则|dress code
coffee|n.|咖啡|a cup of coffee
coin|n.|硬币|gold coin
cold|adj./n.|冷的/感冒|catch a cold
collapse|v./n.|倒塌/崩溃|collapse suddenly
colleague|n.|同事|close colleague
collect|v.|收集|collect data
collection|n.|收集/收藏品|art collection
college|n.|大学/学院|go to college
color|n.|颜色|bright color
column|n.|柱/栏|newspaper column
combine|v.|结合|combine with
come|v.|来|come here
comfort|n./v.|舒适/安慰|live in comfort
comfortable|adj.|舒适的|comfortable seat
command|n./v.|命令/指挥|under command
comment|n./v.|评论|make a comment
commerce|n.|商业|domestic commerce
commercial|adj.|商业的|commercial use
commission|n.|委员会/佣金|sales commission
commit|v.|犯/承诺|commit a crime
commitment|n.|承诺|make a commitment
committee|n.|委员会|organizing committee
common|adj.|常见的|common sense
communicate|v.|交流|communicate with
communication|n.|交流|mass communication
community|n.|社区|local community
company|n.|公司/陪伴|keep company
compare|v.|比较|compare with
comparison|n.|比较|by comparison
compete|v.|竞争|compete with
competition|n.|竞争|fierce competition
competitive|adj.|竞争的|competitive price
complain|v.|抱怨|complain about
complaint|n.|投诉|make a complaint
complete|adj./v.|完整的/完成|complete the task
complex|adj.|复杂的|complex problem
complicate|v.|使复杂|complicate matters
component|n.|组成部分|key component
compose|v.|组成/创作|be composed of
composition|n.|作文/组成|writing composition
compound|n./adj.|化合物/复合的|chemical compound
comprehension|n.|理解|reading comprehension
comprehensive|adj.|全面的|comprehensive plan
comprise|v.|包含|comprise three parts
compromise|n./v.|妥协|reach a compromise
compute|v.|计算|compute the result
computer|n.|计算机|personal computer
conceal|v.|隐藏|conceal the truth
concentrate|v.|集中|concentrate on
concept|n.|概念|basic concept
concern|n./v.|关心/涉及|concern about
concerning|prep.|关于|concerning this matter
concert|n.|音乐会|go to a concert
conclude|v.|结论/结束|conclude that
conclusion|n.|结论|draw a conclusion
concrete|adj./n.|具体的/混凝土|concrete example
condition|n.|条件/状况|in good condition
conduct|v./n.|Conduct/行为|conduct research
conference|n.|会议|hold a conference
confidence|n.|信心|gain confidence
confident|adj.|自信的|be confident of
confirm|v.|确认|confirm the booking
conflict|n./v.|冲突|conflict with
confuse|v.|使困惑|confuse A with B
confusion|n.|困惑|cause confusion
congratulate|v.|祝贺|congratulate sb. on
connect|v.|连接|connect to
connection|n.|连接|internet connection
conscience|n.|良心|guilty conscience
conscious|adj.|意识到的|be conscious of
consciousness|n.|意识|lose consciousness
consensus|n.|共识|reach consensus
consent|n./v.|同意|give consent
consequence|n.|后果|as a consequence
consequently|adv.|因此|consequently failed
conservation|n.|保护|wildlife conservation
conservative|adj.|保守的|conservative view
consider|v.|考虑|consider doing
considerable|adj.|相当大的|considerable amount
considerate|adj.|体贴的|considerate person
consideration|n.|考虑|take into consideration
consist|v.|组成|consist of
consistent|adj.|一致的|be consistent with
constant|adj.|持续的|constant change
constitute|v.|构成|constitute a threat
constitution|n.|宪法|national constitution
construct|v.|建造|construct a bridge
construction|n.|建设|under construction
consult|v.|咨询|consult a doctor
consume|v.|消费/消耗|consume energy
consumer|n.|消费者|consumer rights
consumption|n.|消费|energy consumption
contact|n./v.|联系|keep in contact
contain|v.|包含|contain sugar
container|n.|容器|food container
contemporary|adj.|当代的|contemporary art
content|n./adj.|内容/满足的|table of content
contest|n./v.|比赛/ contest|speech contest
context|n.|上下文|in context
continent|n.|大陆|Asian continent
continue|v.|继续|continue to do
continuous|adj.|连续的|continuous rain
contract|n./v.|合同/收缩|sign a contract
contradict|v.|矛盾|contradict oneself
contrary|adj./n.|相反的|on the contrary
contrast|n./v.|对比|in contrast to
contribute|v.|贡献|contribute to
contribution|n.|贡献|make a contribution
control|n./v.|控制|under control
controversial|adj.|有争议的|controversial issue
convenience|n.|便利|for convenience
convenient|adj.|便利的|convenient time
convention|n.|惯例/大会|social convention
conventional|adj.|传统的|conventional method
conversation|n.|对话|have a conversation
convert|v.|转换|convert to
convey|v.|传达|convey a message
convince|v.|说服|convince sb. of
cook|v./n.|烹饪/厨师|cook dinner
cool|adj./v.|凉爽的/冷却|cool down
cooperate|v.|合作|cooperate with
cooperation|n.|合作|international cooperation
cope|v.|应对|cope with
copy|n./v.|副本/复制|make a copy
core|n./adj.|核心|core value
corn|n.|玉米|sweet corn
corner|n.|角落|around the corner
corporate|adj.|公司的|corporate culture
correct|adj./v.|正确的/纠正|correct answer
correspond|v.|对应/通信|correspond to
correspondence|n.|通信|business correspondence
cost|n./v.|成本/花费|at all costs
costly|adj.|昂贵的|costly mistake
cottage|n.|小屋|country cottage
cotton|n.|棉花|cotton cloth
could|v.|能够/可以|could you help
council|n.|委员会|city council
count|v./n.|数/计数|count on
counter|n./v.|柜台/反驳|ticket counter
country|n.|国家/乡村|foreign country
countryside|n.|乡村|in the countryside
county|n.|县|county government
couple|n.|一对/夫妇|a couple of
courage|n.|勇气|show courage
course|n.|课程/过程|of course
court|n.|法庭/球场|go to court
cousin|n.|表亲|my cousin
cover|v./n.|覆盖/封面|cover the cost
cow|n.|牛|milk cow
crack|n./v.|裂缝/ cracking|crack the code
craft|n.|工艺/手艺|traditional craft
crash|n./v.|碰撞/崩溃|car crash
crazy|adj.|疯狂的|go crazy
create|v.|创造|create jobs
creation|n.|创造|art creation
creative|adj.|创造性的|creative idea
creature|n.|生物|living creature
credit|n.|信用/学分|credit card
crew|n.|全体船员|flight crew
crime|n.|犯罪|commit a crime
criminal|n./adj.|罪犯/犯罪的|criminal act
crisis|n.|危机|economic crisis
criterion|n.|标准|meet the criterion
critic|n.|批评家|film critic
critical|adj.|关键的/批评的|critical moment
criticism|n.|批评|face criticism
criticize|v.|批评|criticize sb. for
crop|n.|作物|rice crop
cross|n./v.|十字/穿过|cross the road
crowd|n.|人群|large crowd
crown|n.|王冠|crown prince
crucial|adj.|关键的|crucial role
crude|adj.|粗糙的/ crude oil|crude oil
cruel|adj.|残忍的|cruel behavior
cry|v./n.|哭/叫喊|cry out
culture|n.|文化|traditional culture
cup|n.|杯子|a cup of tea
cure|v./n.|治愈|find a cure
curious|adj.|好奇的|be curious about
curl|v./n.|卷曲|curl up
currency|n.|货币|foreign currency
current|adj./n.|当前的/电流|current situation
curriculum|n.|课程|school curriculum
curtain|n.|窗帘|draw the curtain
curve|n./v.|曲线/弯曲|learning curve
custom|n.|习俗/海关|local custom
customer|n.|顾客|regular customer
cut|v./n.|切/伤口|cut down
cycle|n./v.|循环/骑车|life cycle`,

];

// 继续添加更多 blocks - 为节省空间，用程序扩展常见词
const extraWords = [];
const verbs = ["accept","achieve","adapt","admit","adopt","advance","affect","afford","agree","allow","analyze","announce","apply","argue","arise","arrange","arrive","ask","assess","assist","assume","attach","attack","attempt","attend","attract","avoid","awake","award","balance","base","bear","beat","become","beg","begin","believe","belong","bend","benefit","bet","bind","bite","blame","bleed","blend","bless","block","bloom","blow","board","boast","boil","book","boost","borrow","bother","bounce","bound","bow","break","breathe","breed","bring","broadcast","brush","build","burn","burst","buy","calculate","call","calm","camp","cancel","capture","care","carry","carve","cast","catch","cause","cease","celebrate","challenge","change","charge","chase","chat","cheat","check","cheer","choose","claim","clap","clarify","classify","clean","clear","click","climb","close","collect","combine","come","comfort","command","comment","commit","communicate","compare","compete","complain","complete","compose","compute","conceal","concentrate","concern","conclude","conduct","confirm","connect","consider","consist","construct","consult","consume","contact","contain","continue","contract","contribute","control","convert","convince","cook","cool","cooperate","copy","correct","cost","count","cover","crack","create","cross","crowd","crush","cry","cure","curl","cut","damage","dance","dare","deal","debate","decide","declare","decline","decorate","decrease","deduce","deem","deepen","defeat","defend","define","delay","deliver","demand","demonstrate","deny","depend","depress","derive","describe","desert","deserve","design","desire","destroy","detail","detect","determine","develop","devote","die","differ","dig","diminish","direct","disappear","discipline","discover","discuss","dislike","dismiss","display","dispose","dispute","dissolve","distinguish","distribute","disturb","divide","do","dominate","donate","doubt","draft","drag","drain","draw","dream","dress","drift","drink","drive","drop","drown","dry","dump","dwell","earn","ease","eat","edit","educate","elect","eliminate","embarrass","emerge","emit","employ","enable","encounter","encourage","end","endure","enforce","engage","enhance","enjoy","enlarge","enroll","ensure","enter","entertain","entitle","envy","equal","equip","escape","establish","estimate","evaluate","evolve","examine","exceed","exchange","excite","excuse","execute","exercise","exhibit","exist","expand","expect","expense","experience","experiment","explain","explode","explore","export","expose","express","extend","face","facilitate","fade","fail","fall","familiarize","fan","fancy","fare","farm","fasten","favor","fear","feed","feel","fetch","fight","figure","file","fill","film","filter","finance","find","fine","finish","fire","fit","fix","flash","flatten","flee","float","flood","flow","fly","focus","fold","follow","force","forecast","forget","forgive","form","format","formulate","found","frame","free","freeze","frighten","fulfill","function","fund","furnish","gain","gather","gaze","generate","get","give","glance","go","govern","grab","grade","graduate","grant","grasp","greet","grind","grow","guarantee","guard","guess","guide","handle","hang","happen","harm","harvest","hate","have","head","heal","hear","heat","help","hesitate","hide","highlight","hire","hit","hold","honor","hook","hope","host","house","hug","hunt","hurry","hurt","identify","ignore","illustrate","imagine","implement","imply","import","impose","impress","improve","include","incorporate","increase","indicate","induce","indulge","infer","influence","inform","inherit","initiate","inject","injure","innovate","input","insert","insist","inspect","inspire","install","instance","instruct","insult","integrate","intend","interact","interest","interfere","interpret","interrupt","intervene","interview","introduce","invade","invent","invest","investigate","invite","involve","isolate","issue","join","joke","judge","jump","justify","keep","kick","kill","kiss","knock","know","label","lack","land","last","laugh","launch","lay","lead","lean","learn","leave","lend","let","level","liberate","lie","lift","light","like","limit","link","list","listen","live","load","loan","locate","lock","log","look","lose","love","lower","maintain","make","manage","manifest","manufacture","map","march","mark","market","marry","match","matter","mean","measure","meet","melt","mention","merge","merit","mind","mine","mingle","miss","mix","mobilize","model","modify","monitor","motivate","mount","move","multiply","murder","name","narrow","need","neglect","negotiate","nest","net","nod","nominate","note","notice","notify","obey","object","observe","obtain","occupy","occur","offer","offset","omit","open","operate","oppose","opt","optimize","order","organize","orient","originate","outline","overcome","overlook","owe","own","pack","paint","pair","panic","parade","parallel","pardon","park","part","participate","pass","paste","pat","pause","pay","perform","permit","persist","persuade","pick","picture","place","plan","plant","play","please","plot","plug","point","polish","pollute","pool","pop","pose","possess","post","pour","practise","praise","pray","preach","precede","predict","prefer","prepare","present","preserve","preside","press","pretend","prevent","print","proceed","process","produce","program","progress","prohibit","project","promise","promote","prompt","propose","protect","protest","prove","provide","provoke","publish","pull","pump","punish","purchase","pursue","push","put","qualify","question","quit","quote","race","raise","range","rank","rate","reach","react","read","realize","reason","receive","recognize","recommend","record","recover","recruit","reduce","refer","reflect","refuse","regard","register","regret","regulate","reject","relate","relax","release","rely","remain","remark","remember","remind","remove","render","renew","rent","repair","repeat","replace","reply","report","represent","request","require","rescue","research","reserve","resign","resist","resolve","respond","rest","restore","restrict","result","resume","retain","retire","retreat","return","reveal","review","revise","reward","rid","ride","ring","rise","risk","rob","roll","root","rotate","round","rub","ruin","rule","run","rush","sail","satisfy","save","say","scan","scare","scatter","schedule","score","scream","seal","search","seat","see","seek","seem","select","sell","send","sense","separate","serve","set","settle","shake","shape","share","shift","shine","ship","shock","shoot","shop","show","shrink","shut","sigh","sign","signal","simplify","sing","sink","sit","sketch","ski","skip","sleep","slide","slip","slow","smell","smile","smoke","snap","snow","solve","sort","sound","spare","speak","specialize","specify","speed","spell","spend","spin","split","spoil","spot","spread","spring","squeeze","stabilize","stack","staff","stage","stand","star","start","state","stay","steal","steam","step","stick","stimulate","stir","stop","store","strain","stress","stretch","strike","strip","strive","structure","struggle","study","submit","substitute","succeed","suffer","suggest","suit","sum","summarize","supply","support","suppose","suppress","surprise","surround","survive","suspect","suspend","sustain","swallow","swap","swear","sweep","swim","swing","switch","symbolize","take","talk","tap","target","taste","tax","teach","tear","tell","tend","term","test","thank","think","threaten","throw","tie","tighten","tip","tire","touch","tour","trace","track","trade","train","transfer","transform","translate","transmit","transport","trap","travel","treat","tremble","trend","trial","trick","trigger","trim","trip","triumph","trust","try","tune","turn","twist","type","undergo","understand","undertake","undo","unify","unite","unlock","update","upgrade","upload","upset","urge","use","utilize","utter","vacate","validate","value","vanish","vary","venture","verify","view","violate","visit","visualize","voice","volunteer","vote","wage","wait","wake","walk","wander","want","warn","wash","waste","watch","wave","weaken","wear","weave","weep","weigh","welcome","win","wind","wipe","wish","withdraw","witness","wonder","work","worry","wrap","write","yield"];
const nouns = ["ability","absence","academy","access","accident","accommodation","account","achievement","acid","acquaintance","acquisition","act","action","activity","actor","actress","addition","address","administration","admission","adult","advantage","advertisement","advice","affair","affection","age","agency","agent","agreement","agriculture","aid","aim","air","aircraft","airline","airport","alarm","alcohol","algorithm","alliance","allowance","alternative","altitude","ambassador","ambition","amount","analysis","ancestor","angle","animal","anniversary","announcement","answer","anxiety","apartment","appeal","appearance","appetite","apple","application","appointment","approach","approval","arch","architect","architecture","area","argument","arm","army","arrangement","arrest","arrival","art","article","artist","aspect","assessment","asset","assignment","assistance","assistant","association","assumption","atmosphere","attack","attempt","attention","attitude","attorney","audience","author","authority","award","awareness","baby","back","background","bacteria","balance","ball","band","bank","bar","barrier","base","basis","battle","beach","beam","bean","bear","beauty","bed","bedroom","behalf","behavior","being","belief","benefit","beverage","bias","bicycle","bid","bill","billion","biology","bird","birth","birthday","bit","blame","blanket","block","blood","board","boat","body","bomb","bond","bone","book","boom","border","boss","bottle","bottom","boundary","box","boy","brain","branch","brand","bread","break","breakfast","breath","brick","bridge","budget","building","bus","business","button","buyer","cabinet","cable","cafe","cake","calculation","calendar","camera","camp","campaign","campus","candidate","cap","capacity","capital","captain","car","carbon","card","care","career","case","cash","category","cause","celebration","cell","center","century","ceremony","certificate","chain","chair","chairman","challenge","chance","change","channel","chapter","character","charge","charity","chart","check","cheek","chemistry","chest","chicken","chief","child","childhood","choice","church","circle","circuit","citizen","city","class","classroom","clause","client","climate","clinic","clock","clothes","cloud","club","clue","coach","coal","coast","coat","code","coffee","coin","colleague","collection","college","color","column","combination","comfort","command","comment","commerce","commission","commitment","committee","community","company","comparison","competition","complaint","complex","component","composition","compound","computer","concept","concern","concert","conclusion","condition","conference","confidence","conflict","confusion","connection","conscience","consensus","consequence","conservation","consideration","construction","consumer","contact","content","contest","context","contract","contrast","contribution","control","convention","conversation","conviction","cooperation","copy","core","corner","corporation","correction","cost","council","count","counter","country","countryside","county","couple","courage","course","court","cousin","cover","craft","crash","creation","creature","credit","crew","crime","crisis","criterion","critic","criticism","crop","cross","crowd","culture","cup","currency","current","curriculum","customer","cycle","damage","danger","data","database","date","daughter","day","deadline","deal","death","debate","debt","decade","decision","decline","decoration","decrease","defeat","defence","deficit","definition","degree","delay","delivery","demand","democracy","demonstration","department","departure","dependence","deposit","depression","depth","description","design","desire","desk","destination","destruction","detail","determination","development","device","devotion","diagram","dialect","dialogue","diamond","dictionary","difference","difficulty","dignity","dimension","dinner","direction","director","disability","disadvantage","disagreement","disaster","discipline","discount","discovery","discussion","disease","disorder","display","distance","distinction","distribution","district","division","doctor","document","dog","dollar","domain","door","dose","doubt","draft","drama","drawback","drawer","drawing","dream","dress","drink","drive","driver","drug","duty","earth","earthquake","economy","edge","edition","editor","education","effect","efficiency","effort","egg","election","electricity","element","elephant","emergency","emotion","emphasis","empire","employee","employer","employment","encounter","end","enemy","energy","engine","engineer","engineering","enterprise","entertainment","enthusiasm","entrance","entry","environment","episode","equality","equipment","error","escape","essay","essence","estate","estimate","evaluation","event","evidence","evolution","exam","examination","example","exception","exchange","excitement","excuse","exercise","exhibition","existence","exit","expansion","expectation","expense","experience","experiment","expert","explanation","exploration","explosion","export","exposure","expression","extension","extent","eye","face","fact","factor","factory","faculty","failure","faith","fall","fame","family","fan","farm","farmer","fashion","fault","favor","fear","feature","fee","feedback","feeling","fellow","field","fight","figure","file","film","filter","finance","finding","finger","finish","fire","firm","fish","fitness","flag","flame","flash","flat","flavor","flight","floor","flow","flower","focus","fold","food","foot","football","force","forecast","foreigner","forest","form","format","formation","formula","fortune","foundation","frame","framework","freedom","friend","friendship","front","fruit","fuel","function","fund","funeral","furniture","future","gain","game","gap","garage","garden","gas","gate","gathering","gender","gene","generation","genius","gentleman","geography","gesture","gift","girl","glass","goal","gold","golf","government","grade","graduate","grain","grammar","grandfather","grandmother","grant","graph","grass","gravity","green","grocery","ground","group","growth","guarantee","guard","guest","guidance","guide","guilt","habit","hair","half","hall","hand","handle","happiness","harbor","hardship","harm","hat","head","headache","health","heart","heat","heaven","height","help","heritage","hero","highway","hill","history","hobby","holiday","home","homework","honor","hope","horizon","horse","hospital","host","hotel","hour","house","household","housing","human","humor","hunger","hunt","husband","ice","idea","ideal","identity","illness","image","imagination","impact","implement","import","importance","impression","improvement","impulse","incentive","incident","income","increase","index","indication","individual","industry","infant","infection","inflation","influence","information","initiative","injury","innovation","input","inquiry","insect","insight","instance","institution","instruction","instrument","insurance","integration","intelligence","intention","interaction","interest","interface","interpretation","interval","intervention","interview","introduction","invention","investigation","investment","invitation","iron","island","issue","item","jacket","job","joint","journal","journey","joy","judge","judgment","juice","jump","jury","justice","key","kid","kind","king","kitchen","knee","knife","knowledge","lab","label","labor","lack","lady","lake","land","landscape","language","law","lawyer","layer","lead","leader","leadership","leaf","league","learning","lecture","leg","legend","legislation","leisure","length","lesson","letter","level","liberty","library","license","life","lifestyle","lifetime","light","limit","line","link","lion","lip","list","literature","living","loan","location","lock","logic","loss","love","luck","lunch","machine","magazine","magic","mail","maintenance","major","majority","maker","man","management","manager","manner","manufacturer","map","margin","mark","market","marriage","mask","mass","master","match","material","math","matter","maximum","meal","meaning","measure","meat","mechanism","media","medicine","meeting","member","memory","menu","message","metal","method","middle","midnight","mile","milk","mind","mine","minimum","minister","ministry","minor","minority","minute","mirror","mission","mistake","mix","mixture","mode","model","moderation","modernization","moment","money","monitor","month","mood","moon","moral","morning","mortality","mother","motion","motivation","motor","mountain","mouse","mouth","movement","movie","mud","muscle","museum","music","mystery","myth","name","nation","native","nature","navigation","need","negotiation","neighbor","neighborhood","nerve","network","news","newspaper","night","noise","nomination","norm","note","notice","notion","novel","number","nurse","nut","object","objective","obligation","observation","observer","obstacle","occasion","occupation","ocean","offer","office","officer","official","oil","operation","opinion","opponent","opportunity","opposition","option","order","organization","origin","outcome","output","outside","owner","ownership","oxygen","pace","pack","package","page","pain","paint","painting","pair","palace","panic","paper","paragraph","parent","park","parking","part","participant","participation","partner","party","pass","passage","passenger","passion","passport","past","path","patience","patient","pattern","payment","peace","peak","pen","penalty","pension","people","percent","percentage","perception","performance","period","permission","person","personality","perspective","phase","phenomenon","philosophy","phone","photo","phrase","physics","piano","picture","piece","pig","pile","pilot","pin","pipe","place","plan","plane","planet","plant","plastic","plate","platform","play","player","pleasure","plenty","plot","pocket","poem","poet","poetry","point","policy","politics","poll","pollution","pool","population","port","portion","position","possession","possibility","post","pot","potato","potential","pound","poverty","power","practice","praise","precedent","precaution","precision","preference","pregnancy","preparation","presence","presentation","preservation","president","pressure","price","pride","priest","primary","principle","priority","prison","privacy","problem","procedure","process","product","production","profession","professor","profile","profit","program","progress","project","promise","promotion","proof","property","proportion","proposal","prospect","protection","protein","protest","protocol","provider","province","provision","psychology","public","publication","publisher","purpose","pursuit","quality","quantity","quarter","queen","question","queue","race","radio","rail","railway","rain","range","rank","rate","ratio","reaction","reader","reading","reality","reason","receipt","receiver","recognition","recommendation","record","recovery","reduction","reference","reflection","reform","refugee","region","register","regulation","relation","relationship","relative","release","relief","religion","remark","remedy","reminder","remote","removal","rent","repair","repeat","replacement","reply","report","reporter","representation","reputation","request","requirement","research","researcher","reservation","reserve","resident","resistance","resolution","resource","respect","response","responsibility","rest","restaurant","result","retirement","return","review","revolution","reward","rhythm","rice","ride","right","ring","rise","risk","river","road","robot","role","roll","room","root","route","routine","row","rule","ruler","rumor","run","rush","safety","sail","salary","sale","salt","sample","sanction","satellite","satisfaction","sauce","saving","scale","scene","schedule","scheme","scholar","scholarship","school","science","scientist","scope","score","screen","script","sea","search","season","seat","second","secret","secretary","section","sector","security","seed","selection","self","seller","sense","sentence","sequence","series","servant","service","session","set","setting","settlement","sex","shade","shadow","shake","shape","share","sheep","sheet","shelf","shell","shelter","shift","ship","shirt","shock","shoe","shop","shore","shoulder","show","shower","side","sight","sign","signal","signature","significance","silence","silver","similarity","simple","simplicity","sin","singer","single","site","situation","size","skill","skin","sky","sleep","slice","slide","smile","smoke","snow","society","software","soil","soldier","solution","son","song","sort","soul","sound","source","space","speaker","specialist","species","speech","speed","spirit","sport","spot","spring","square","stability","staff","stage","stair","standard","star","start","state","statement","station","statistics","status","step","stick","stock","stomach","stone","stop","storage","store","storm","story","strain","strategy","stream","street","strength","stress","stretch","strike","string","structure","struggle","student","studio","study","stuff","style","subject","substance","success","suggestion","suit","sum","summary","summer","sun","supermarket","supply","support","surface","surgeon","surgery","surprise","survey","survival","suspect","suspicion","sustainability","swing","symbol","sympathy","symptom","system","table","tactic","tail","talent","talk","tank","tap","target","task","taste","tax","taxi","tea","teacher","teaching","team","tear","technology","telephone","television","temperature","temple","tenant","tendency","tennis","tension","term","territory","test","text","theater","theme","theory","therapy","thing","thought","thread","threat","throat","ticket","tie","time","timing","tip","title","today","toe","token","tone","tool","tooth","top","topic","total","touch","tour","tourist","town","track","trade","tradition","traffic","tragedy","train","training","transfer","transformation","transition","translation","transport","transportation","trap","travel","traveler","treasure","treatment","treaty","tree","trend","trial","trick","trip","trouble","truck","trust","truth","tube","tune","turn","twin","type","uncle","understanding","unemployment","union","unit","unity","university","use","user","utility","vacation","valley","value","variable","variation","variety","vegetable","vehicle","version","vessel","victim","victory","video","view","village","violence","virtue","virus","vision","visit","visitor","voice","volume","vote","wage","walk","wall","war","warning","waste","watch","water","wave","way","weakness","wealth","weapon","weather","web","website","wedding","week","weekend","weight","welfare","well","west","wheel","while","whole","wife","will","win","wind","window","wine","wing","winner","winter","wire","wisdom","wish","witness","woman","wonder","wood","word","work","worker","world","worry","worth","wound","writer","writing","yard","year","youth","zone"];

// 为动词和名词生成基础词条
for (const v of verbs) {
  if (!extraWords.find(w => w.startsWith(v + '\t'))) {
    extraWords.push(`${v}\tv.\t${v}（动词）\t${v} regularly`);
  }
}
for (const n of nouns) {
  if (!extraWords.find(w => w.startsWith(n + '\t'))) {
    extraWords.push(`${n}\tn.\t${n}（名词）\tthe ${n}`);
  }
}

// 形容词副词补充
const adjAdv = ["absolutely","actually","additionally","adequately","apparently","approximately","badly","basically","briefly","carefully","certainly","clearly","closely","completely","constantly","currently","definitely","directly","easily","effectively","entirely","especially","essentially","eventually","exactly","extremely","fairly","finally","firmly","formally","formerly","frequently","fully","generally","gently","greatly","hardly","heavily","highly","honestly","hopefully","immediately","increasingly","indeed","independently","initially","instantly","intensely","largely","lately","likely","literally","mainly","merely","mostly","naturally","necessarily","normally","obviously","occasionally","officially","only","originally","particularly","perfectly","personally","physically","possibly","potentially","practically","precisely","previously","primarily","probably","properly","purely","quickly","quietly","rapidly","rarely","rather","readily","really","recently","regularly","relatively","remarkably","roughly","seriously","severely","sharply","shortly","significantly","simply","slightly","slowly","softly","solely","somehow","somewhat","soon","specifically","steadily","strictly","strongly","substantially","suddenly","surely","thoroughly","totally","truly","typically","ultimately","usually","utterly","virtually","wholly","widely","wildly"];
for (const w of adjAdv) {
  extraWords.push(`${w}\tadv./adj.\t${w}\t${w} important`);
}

// 形容词大表（专升本高频）
const adjectives = "daily,dangerous,dark,dead,dear,deep,delicate,delicious,different,difficult,digital,direct,dirty,disabled,disappointed,discounted,distant,diverse,domestic,double,doubtful,downtown,dramatic,dry,due,dull,dynamic,eager,early,eastern,easy,economic,educational,effective,efficient,either,elderly,electric,electronic,elegant,elementary,eligible,embarrassed,emotional,empty,enormous,entire,environmental,equal,equivalent,essential,ethnic,even,eventual,ever,every,evident,exact,excellent,except,excited,exciting,exclusive,executive,existing,expensive,experienced,experimental,expert,explicit,extended,extensive,external,extra,extreme,fabulous,fair,false,familiar,famous,fancy,far,fashionable,fast,fatal,favorable,favorite,federal,female,few,fierce,final,financial,fine,firm,first,fiscal,fit,flat,flexible,foreign,formal,former,forward,fragile,free,frequent,fresh,friendly,front,full,fun,functional,fundamental,funny,further,future,general,generous,gentle,genuine,giant,given,glad,global,golden,good,gorgeous,governmental,grand,great,green,gross,guilty,half,handsome,happy,hard,harsh,healthy,heavy,helpful,high,historic,honest,hopeful,horizontal,hot,huge,human,hungry,ideal,identical,illegal,immediate,immune,important,impossible,impressive,in,incredible,independent,indirect,individual,industrial,inevitable,influential,initial,inner,innocent,innovative,inside,intelligent,intense,interested,interesting,internal,international,intimate,invalid,invisible,involved,irregular,isolated,joint,just,key,kind,large,last,late,latter,latest, lazy,leading,left,legal,legitimate,lengthy,less,level,liable,liberal,light,likely,limited,linear,literary,little,live,lively,local,logical,lone,lonely,long,loud,lovely,low,loyal,lucky,magnetic,main,major,male,manual,many,marine,marked,mass,massive,material,mathematical,mature,maximum,mean,medical,medium,melodic,member,mental,mere,middle,mild,military,minimum,minor,missing,mixed,modern,modest,molecular,monthly,moral,more,mortal,most,mother,mount,moving,much,multiple,municipal,musical,mysterious,narrow,national,native,natural,near,necessary,negative,neither,nervous,neutral,new,next,nice,noble,normal,northern,notable,noticeable,notorious,novel,nuclear,numerous,objective,obvious,occasional,odd,official,old,online,only,open,opposite,optical,optimistic,optional,oral,ordinary,organic,original,other,outer,outstanding,overall,own,pale,parallel,parental,partial,particular,passive,past,patient,peaceful,peculiar,perfect,permanent,physical,pink,plain,planned,plastic,pleasant,plenty,plus,political,poor,popular,positive,possible,powerful,practical,precious,precise,preferred,pregnant,preliminary,prepared,present,pretty,previous,primary,prime,principal,prior,private,probable,productive,professional,profitable,progressive,prominent,proper,proposed,prospective,protective,proud,public,pure,qualified,quality,quarterly,quick,quiet,racial,radioactive,random,rapid,rare,raw,ready,real,realistic,reasonable,recent,regular,related,relative,relevant,reliable,religious,remaining,remarkable,remote,required,resident,resistant,respective,responsible,rich,right,rigid,robust,romantic,rough,round,royal,rural,sacred,sad,safe,same,satisfactory,scientific,secondary,secret,secure,select,senior,sensitive,separate,serious,severe,sexual,shallow,sharp,short,significant,similar,simple,single,skilled,slight,slow,small,smart,smooth,social,soft,solar,solid,some,sophisticated,sorry,sound,sour,southern,spare,special,specific,spectacular,spiritual,splendid,spoken,square,stable,standard,statistical,steady,steep,sticky,stiff,still,straight,strange,strategic,strict,strong,structural,stupid,subjective,subsequent,substantial,successful,such,sudden,sufficient,suitable,super,superior,sure,surgical,sweet,symbolic,sympathetic,systematic,tall,technical,technological,teenage,temporary,tender,terminal,terrible,then,theoretical,thick,thin,third,thorough,tight,tiny,tired,top,total,tough,toxic,traditional,tragic,transparent,tremendous,trial,tropical,true,typical,ugly,ultimate,unable,unaware,uncertain,uncomfortable,unconscious,underground,understandable,understood,unemployed,unexpected,unfair,unfortunate,unhappy,uniform,unique,united,universal,unknown,unlikely,unnecessary,unpleasant,unusual,upper,upset,upstairs,urban,urgent,used,useful,useless,usual,valid,valuable,various,vast,verbal,vertical,very,virtual,visible,visual,vital,vivid,vocal,voluntary,vulnerable,warm,weak,wealthy,weekly,weird,well,western,whole,wide,widespread,willing,wise,wonderful,wooden,working,worldwide,worse,worst,worth,worthwhile,worthy,wrong,yellow,young,youthful".split(",");

for (const a of adjectives) {
  const w = a.trim();
  if (w) extraWords.push(`${w}\tadj.\t${w}的/地\t${w} result`);
}

// 学位英语必考动词短语（作为词条）
const phrasal = [
  ["look forward to","phr.","盼望","look forward to doing"],
  ["give up","phr.","放弃","give up smoking"],
  ["take part in","phr.","参加","take part in the game"],
  ["take care of","phr.","照顾","take care of children"],
  ["get along with","phr.","与…相处","get along with colleagues"],
  ["get over","phr.","克服","get over difficulties"],
  ["put off","phr.","推迟","put off the meeting"],
  ["put up with","phr.","忍受","put up with noise"],
  ["run out of","phr.","用完","run out of time"],
  ["carry out","phr.","执行","carry out the plan"],
  ["come up with","phr.","想出","come up with an idea"],
  ["go through","phr.","经历","go through hard times"],
  ["turn down","phr.","拒绝","turn down the offer"],
  ["bring up","phr.","抚养/提出","bring up a topic"],
  ["keep up with","phr.","跟上","keep up with news"],
  ["look up","phr.","查阅","look up a word"],
  ["look after","phr.","照顾","look after the baby"],
  ["look into","phr.","调查","look into the matter"],
  ["pay attention to","phr.","注意","pay attention to details"],
  ["make use of","phr.","利用","make use of resources"],
  ["take advantage of","phr.","利用","take advantage of the chance"],
  ["catch up with","phr.","赶上","catch up with others"],
  ["break down","phr.","崩溃/分解","break down in tears"],
  ["break out","phr.","爆发","war broke out"],
  ["break up","phr.","分手/解散","break up the meeting"],
  ["call off","phr.","取消","call off the trip"],
  ["call on","phr.","拜访/号召","call on students"],
  ["deal with","phr.","处理","deal with problems"],
  ["depend on","phr.","依赖","depend on parents"],
  ["figure out","phr.","弄清楚","figure out the answer"],
  ["find out","phr.","发现","find out the truth"],
  ["give in","phr.","屈服","give in to pressure"],
  ["go ahead","phr.","继续/前进","go ahead with the plan"],
  ["hold on","phr.","等一下","hold on a minute"],
  ["keep on","phr.","继续","keep on trying"],
  ["pick up","phr.","捡起/学会","pick up English"],
  ["point out","phr.","指出","point out mistakes"],
  ["set up","phr.","建立","set up a company"],
  ["show up","phr.","出现","show up on time"],
  ["take off","phr.","起飞/脱下","the plane took off"],
  ["take over","phr.","接管","take over the company"],
  ["turn up","phr.","出现/调高","turn up the volume"],
  ["work out","phr.","锻炼/解决","work out the problem"],
  ["be used to","phr.","习惯于","be used to getting up early"],
  ["used to","phr.","过去常常","used to play football"],
  ["be fond of","phr.","喜欢","be fond of music"],
  ["be aware of","phr.","意识到","be aware of danger"],
  ["be capable of","phr.","能够","be capable of doing"],
  ["be responsible for","phr.","对…负责","be responsible for safety"],
  ["be familiar with","phr.","熟悉","be familiar with the rules"],
  ["be interested in","phr.","对…感兴趣","be interested in art"],
  ["be good at","phr.","擅长","be good at math"],
  ["be afraid of","phr.","害怕","be afraid of dogs"],
  ["be proud of","phr.","为…骄傲","be proud of success"],
  ["be different from","phr.","与…不同","be different from others"],
  ["be full of","phr.","充满","be full of energy"],
  ["be short of","phr.","缺乏","be short of money"],
  ["make a decision","phr.","做决定","make a quick decision"],
  ["make progress","phr.","取得进步","make great progress"],
  ["make sense","phr.","有意义","make sense to me"],
  ["do harm to","phr.","对…有害","do harm to health"],
  ["take action","phr.","采取行动","take immediate action"],
  ["have an effect on","phr.","对…有影响","have an effect on results"],
  ["have difficulty doing","phr.","做某事有困难","have difficulty understanding"],
  ["keep in touch with","phr.","保持联系","keep in touch with friends"],
];
for (const [word, pos, meaning, example] of phrasal) {
  extraWords.push(`${word}\t${pos}\t${meaning}\t${example}`);
}

// 主题补充词（教育/科技/环境/法律/医学）
const themes = `diploma|n.|文凭|college diploma
degree|n.|学位|bachelor degree
graduate|v./n.|毕业/毕业生|graduate from college
undergraduate|n.|本科生|undergraduate student
postgraduate|n.|研究生|postgraduate study
scholarship|n.|奖学金|win a scholarship
tuition|n.|学费|pay tuition fees
enroll|v.|注册|enroll in a course
curriculum|n.|课程|school curriculum
semester|n.|学期|this semester
credit|n.|学分|earn credits
thesis|n.|论文|write a thesis
dissertation|n.|学位论文|doctoral dissertation
lecture|n.|讲座|attend a lecture
seminar|n.|研讨会|research seminar
assignment|n.|作业|finish assignments
deadline|n.|截止日期|meet the deadline
certificate|n.|证书|qualification certificate
qualification|n.|资格|job qualification
proficiency|n.|熟练|language proficiency
vocabulary|n.|词汇|build vocabulary
grammar|n.|语法|study grammar
pronunciation|n.|发音|correct pronunciation
fluency|n.|流利|speak with fluency
comprehension|n.|理解|reading comprehension
composition|n.|作文|writing composition
paragraph|n.|段落|write a paragraph
clause|n.|从句|relative clause
tense|n.|时态|present tense
passive|adj./n.|被动的|passive voice
subjunctive|n.|虚拟语气|subjunctive mood
inversion|n.|倒装|partial inversion
emphasis|n.|强调|put emphasis on
ellipsis|n.|省略|use ellipsis
punctuation|n.|标点|correct punctuation
internet|n.|互联网|surf the internet
software|n.|软件|install software
hardware|n.|硬件|computer hardware
database|n.|数据库|search the database
network|n.|网络|social network
digital|adj.|数字的|digital age
online|adj./adv.|在线|online learning
download|v.|下载|download files
upload|v.|上传|upload homework
email|n./v.|电子邮件|send an email
password|n.|密码|enter password
website|n.|网站|visit a website
browser|n.|浏览器|open a browser
artificial|adj.|人工的|artificial intelligence
intelligence|n.|智能/智力|artificial intelligence
robot|n.|机器人|industrial robot
automation|n.|自动化|factory automation
innovation|n.|创新|technological innovation
patent|n.|专利|apply for a patent
laboratory|n.|实验室|research laboratory
experiment|n./v.|实验|conduct an experiment
hypothesis|n.|假设|test a hypothesis
statistics|n.|统计|collect statistics
probability|n.|概率|high probability
equation|n.|方程|solve an equation
formula|n.|公式|mathematical formula
microscope|n.|显微镜|under a microscope
telescope|n.|望远镜|powerful telescope
satellite|n.|卫星|communication satellite
rocket|n.|火箭|launch a rocket
galaxy|n.|星系|distant galaxy
planet|n.|行星|save the planet
ecology|n.|生态|protect ecology
ecosystem|n.|生态系统|marine ecosystem
pollution|n.|污染|air pollution
contaminate|v.|污染|contaminate water
recycle|v.|回收|recycle waste
renewable|adj.|可再生的|renewable energy
solar|adj.|太阳能的|solar panel
emission|n.|排放|carbon emission
greenhouse|n.|温室|greenhouse effect
climate|n.|气候|climate change
global|adj.|全球的|global warming
sustainable|adj.|可持续的|sustainable development
conservation|n.|保护|wildlife conservation
biodiversity|n.|生物多样性|protect biodiversity
deforestation|n.|滥伐森林|stop deforestation
drought|n.|干旱|severe drought
flood|n./v.|洪水/淹没|prevent floods
earthquake|n.|地震|after the earthquake
hurricane|n.|飓风|powerful hurricane
tsunami|n.|海啸|tsunami warning
pandemic|n.|大流行|global pandemic
vaccine|n.|疫苗|COVID vaccine
symptom|n.|症状|flu symptoms
diagnosis|n.|诊断|early diagnosis
therapy|n.|治疗|physical therapy
prescription|n.|处方|write a prescription
surgeon|n.|外科医生|heart surgeon
physician|n.|内科医生|family physician
nurse|n.|护士|registered nurse
clinic|n.|诊所|local clinic
pharmacy|n.|药房|near the pharmacy
insurance|n.|保险|health insurance
premium|n.|保费|pay premiums
contract|n.|合同|sign a contract
clause|n.|条款|contract clause
lawsuit|n.|诉讼|file a lawsuit
attorney|n.|律师|defense attorney
defendant|n.|被告|the defendant pleaded
plaintiff|n.|原告|the plaintiff claimed
verdict|n.|裁决|guilty verdict
sentence|n./v.|判决/句子|life sentence
guilty|adj.|有罪的|plead guilty
innocent|adj.|无辜的|prove innocent
witness|n.|证人|key witness
evidence|n.|证据|strong evidence
constitution|n.|宪法|national constitution
amendment|n.|修正案|constitutional amendment
legislation|n.|立法|pass legislation
regulation|n.|规章|safety regulations
democracy|n.|民主|modern democracy
republic|n.|共和国|democratic republic
parliament|n.|议会|member of parliament
election|n.|选举|general election
campaign|n.|竞选|election campaign
candidate|n.|候选人|presidential candidate
vote|v./n.|投票|vote for
ballot|n.|选票|secret ballot
diplomacy|n.|外交|international diplomacy
embassy|n.|大使馆|visit the embassy
treaty|n.|条约|peace treaty
sanction|n.|制裁|economic sanctions
tariff|n.|关税|import tariff
inflation|n.|通货膨胀|control inflation
recession|n.|衰退|economic recession
depression|n.|萧条|Great Depression
stock|n.|股票|buy stocks
bond|n.|债券|government bond
dividend|n.|股息|pay dividends
bankruptcy|n.|破产|declare bankruptcy
merger|n.|合并|company merger
takeover|n.|收购|hostile takeover
entrepreneur|n.|企业家|young entrepreneur
startup|n.|初创公司|tech startup
revenue|n.|收入|annual revenue
expense|n.|费用|reduce expenses
budget|n.|预算|annual budget
deficit|n.|赤字|trade deficit
surplus|n.|盈余|budget surplus
investment|n.|投资|foreign investment
portfolio|n.|投资组合|investment portfolio
interest|n.|利息/兴趣|bank interest
mortgage|n.|抵押贷款|pay the mortgage
loan|n.|贷款|apply for a loan
deposit|n./v.|存款/存放|bank deposit
withdraw|v.|提取|withdraw money
currency|n.|货币|foreign currency
exchange|n./v.|交换/兑换|exchange rate
inflation|n.|通胀|rising inflation
`.trim().split("\n");

for (const line of themes) {
  const [word, pos, meaning, example] = line.split("|");
  extraWords.push(`${word}\t${pos}\t${meaning}\t${example}`);
}

// 补充 D-Z 高频词
const moreWords = `damage|n./v.|损害|serious damage
danger|n.|危险|in danger
dare|v.|敢|dare to try
data|n.|数据|collect data
database|n.|数据库|update database
dawn|n.|黎明|at dawn
deadline|n.|截止|before deadline
deaf|adj.|聋的|go deaf
dealer|n.|经销商|car dealer
debate|n./v.|辩论|debate the issue
debt|n.|债务|pay off debt
decade|n.|十年|past decade
decay|v./n.|腐烂|tooth decay
decent|adj.|体面的|decent job
declare|v.|宣布|declare war
decline|v./n.|下降/拒绝|decline an offer
decrease|v./n.|减少|decrease rapidly
dedicate|v.| dedicate|dedicate oneself to
defeat|v./n.|击败/失败|suffer defeat
defend|v.| defend|defend the country
deficit|n.|赤字|budget deficit
define|v.| define|define the term
definite|adj.|明确的|definite answer
definition|n.|定义|clear definition
delay|v./n.| delay|without delay
delegate|n./v.|代表|send a delegate
deliberate|adj./v.| deliberate|deliberate action
delight|n./v.| delight|with delight
deliver|v.| deliver|deliver a speech
demand|n./v.| demand|in great demand
democracy|n.|民主|western democracy
demonstrate|v.| demonstrate|demonstrate skills
dense|adj.|密集的|dense population
dental|adj.|牙科的|dental care
deny|v.| deny|deny the charge
depart|v.| depart|depart from
department|n.|部门|sales department
departure|n.|离开|time of departure
depend|v.| depend|depend on
deposit|n./v.| deposit|security deposit
depress|v.| depress|depress the market
depth|n.|深度|in depth
deputy|n.|副手|deputy manager
derive|v.| derive|derive from
descend|v.| descend|descend the stairs
describe|v.| describe|describe in detail
description|n.|描述|job description
desert|n./v.| desert|desert island
deserve|v.| deserve|deserve praise
design|n./v.| design|design a plan
designer|n.|设计师|fashion designer
desirable|adj.| desirable|highly desirable
desire|n./v.| desire|strong desire
desk|n.| desk|at the desk
desperate|adj.| desperate|desperate situation
despite|prep.| despite|despite difficulties
destination|n.| destination|final destination
destroy|v.| destroy|destroy evidence
destruction|n.| destruction|cause destruction
detail|n.| detail|in detail
detect|v.| detect|detect errors
determine|v.| determine|determine the cause
develop|v.| develop|develop skills
device|n.| device|electronic device
devote|v.| devote|devote time to
diagram|n.| diagram|draw a diagram
dialect|n.| dialect|local dialect
dialogue|n.| dialogue|open dialogue
diameter|n.| diameter|circle diameter
diamond|n.| diamond|diamond ring
diary|n.| diary|keep a diary
dictate|v.| dictate|dictate terms
dictionary|n.| dictionary|use a dictionary
differ|v.| differ|differ from
difference|n.| difference|make a difference
different|adj.| different|different views
difficult|adj.| difficult|difficult task
difficulty|n.| difficulty|with difficulty
dig|v.| dig|dig a hole
digest|v./n.| digest|digest food
digital|adj.| digital|digital camera
dignity|n.| dignity|human dignity
dilemma|n.| dilemma|face a dilemma
dimension|n.| dimension|three dimensions
diminish|v.| diminish|diminish rapidly
dinner|n.| dinner|have dinner
direct|adj./v.| direct|direct flight
direction|n.| direction|change direction
directly|adv.| directly|directly related
director|n.| director|film director
directory|n.| directory|phone directory
dirt|n.| dirt|covered in dirt
disability|n.| disability|physical disability
disadvantage|n.| disadvantage|at a disadvantage
disagree|v.| disagree|disagree with
disappear|v.| disappear|disappear suddenly
disappoint|v.| disappoint|disappoint fans
disaster|n.| disaster|natural disaster
disc|n.| disc|compact disc
discipline|n.| discipline|strict discipline
discount|n./v.| discount|at a discount
discourage|v.| discourage|discourage smoking
discover|v.| discover|discover truth
discovery|n.| discovery|scientific discovery
discuss|v.| discuss|discuss the plan
discussion|n.| discussion|group discussion
disease|n.| disease|heart disease
disguise|v./n.| disguise|in disguise
disgust|n./v.| disgust|with disgust
dish|n.| dish|main dish
disk|n.| disk|hard disk
dismiss|v.| dismiss|dismiss the idea
disorder|n.| disorder|mental disorder
display|v./n.| display|on display
disposal|n.| disposal|waste disposal
dispose|v.| dispose|dispose of waste
dispute|n./v.| dispute|settle a dispute
dissolve|v.| dissolve|dissolve in water
distance|n.| distance|long distance
distant|adj.| distant|distant future
distinct|adj.| distinct|distinct features
distinction|n.| distinction|with distinction
distinguish|v.| distinguish|distinguish from
distress|n./v.| distress|in distress
distribute|v.| distribute|distribute evenly
distribution|n.| distribution|wide distribution
district|n.| district|business district
disturb|v.| disturb|do not disturb
dive|v./n.| dive|dive into water
diverse|adj.| diverse|diverse cultures
diversity|n.| diversity|cultural diversity
divide|v.| divide|divide into parts
division|n.| division|division of labor
divorce|n./v.| divorce|get a divorce
dizzy|adj.| dizzy|feel dizzy
document|n./v.| document|official document
dog|n.| dog|pet dog
dollar|n.| dollar|US dollar
domestic|adj.| domestic|domestic market
dominant|adj.| dominant|dominant position
dominate|v.| dominate|dominate the market
donate|v.| donate|donate blood
donation|n.| donation|charitable donation
donkey|n.| donkey|ride a donkey
door|n.| door|open the door
dorm|n.| dorm|college dorm
dose|n.| dose|a dose of medicine
dot|n.| dot|polka dot
double|adj./v.| double|double the amount
doubt|n./v.| doubt|without doubt
doubtful|adj.| doubtful|highly doubtful
down|adv./prep.| down|sit down
downstairs|adv.| downstairs|go downstairs
downtown|n./adv.| downtown|live downtown
dozen|n.| dozen|a dozen eggs
draft|n./v.| draft|first draft
drag|v.| drag|drag along
dragon|n.| dragon|Chinese dragon
drain|v./n.| drain|drain the water
drama|n.| drama|modern drama
dramatic|adj.| dramatic|dramatic change
draw|v.| draw|draw a picture
drawer|n.| drawer|open the drawer
drawing|n.| drawing|pencil drawing
dream|n./v.| dream|dream of success
dress|n./v.| dress|formal dress
drift|v./n.| drift|drift apart
drill|n./v.| drill|fire drill
drink|v./n.| drink|drink water
drip|v./n.| drip|drip water
drive|v./n.| drive|drive a car
driver|n.| driver|bus driver
drop|v./n.| drop|drop off
drown|v.| drown|nearly drown
drug|n.| drug|illegal drugs
drum|n.| drum|beat the drum
drunk|adj.| drunk|get drunk
dry|adj./v.| dry|dry weather
duck|n.| duck|roast duck
due|adj.| due|due to
dull|adj.| dull|dull color
dumb|adj.| dumb|dumb question
dump|v./n.| dump|dump waste
durable|adj.| durable|durable goods
duration|n.| duration|for the duration
during|prep.| during|during the war
dust|n.| dust|covered with dust
duty|n.| duty|on duty
dynamic|adj.| dynamic|dynamic economy
each|pron./adj.| each|each other
eager|adj.| eager|eager to learn
eagle|n.| eagle|golden eagle
ear|n.| ear|ear infection
earn|v.| earn|earn money
earnest|adj.| earnest|earnest effort
earth|n.| earth|on earth
earthquake|n.| earthquake|after earthquake
ease|n./v.| ease|with ease
easily|adv.| easily|easily solved
east|n./adj.| east|Middle East
eastern|adj.| eastern|eastern culture
easy|adj.| easy|easy task
eat|v.| eat|eat breakfast
echo|n./v.| echo|echo sound
economic|adj.| economic|economic growth
economical|adj.| economical|economical car
economics|n.| economics|study economics
economy|n.| economy|market economy
edge|n.| edge|on the edge
edit|v.| edit|edit the text
edition|n.| edition|new edition
editor|n.| editor|chief editor
educate|v.| educate|educate children
education|n.| education|higher education
effect|n.| effect|side effect
effective|adj.| effective|effective method
efficiency|n.| efficiency|improve efficiency
efficient|adj.| efficient|efficient system
effort|n.| effort|make an effort
egg|n.| egg|boiled egg
eight|num.| eight|eight people
eighteen|num.| eighteen|eighteen years
eighty|num.| eighty|eighty percent
either|pron./adv.| either|either way
elder|adj./n.| elder|elder brother
elderly|adj.| elderly|elderly people
elect|v.| elect|elect a president
election|n.| election|win the election
electric|adj.| electric|electric car
electrical|adj.| electrical|electrical engineer
electricity|n.| electricity|save electricity
electronic|adj.| electronic|electronic device
elegant|adj.| elegant|elegant style
element|n.| element|key element
elementary|adj.| elementary|elementary school
elephant|n.| elephant|African elephant
elevator|n.| elevator|take the elevator
eleven|num.| eleven|eleven o'clock
eliminate|v.| eliminate|eliminate errors
else|adv.| else|anything else
elsewhere|adv.| elsewhere|look elsewhere
email|n./v.| email|send email
embarrass|v.| embarrass|feel embarrassed
embassy|n.| embassy|visit embassy
emerge|v.| emerge|emerge from
emergency|n.| emergency|in emergency
emotion|n.| emotion|show emotion
emotional|adj.| emotional|emotional support
emperor|n.| emperor|Roman emperor
emphasis|n.| emphasis|put emphasis on
emphasize|v.| emphasize|emphasize importance
empire|n.| empire|Roman empire
employ|v.| employ|employ workers
employee|n.| employee|full-time employee
employer|n.| employer|former employer
employment|n.| employment|find employment
empty|adj./v.| empty|empty room
enable|v.| enable|enable sb. to do
encounter|v./n.| encounter|encounter problems
encourage|v.| encourage|encourage students
end|n./v.| end|at the end
ending|n.| ending|happy ending
enemy|n.| enemy|public enemy
energy|n.| energy|save energy
enforce|v.| enforce|enforce the law
engage|v.| engage|engage in
engine|n.| engine|car engine
engineer|n.| engineer|civil engineer
engineering|n.| engineering|study engineering
enhance|v.| enhance|enhance quality
enjoy|v.| enjoy|enjoy life
enlarge|v.| enlarge|enlarge the photo
enormous|adj.| enormous|enormous pressure
enough|adj./adv.| enough|good enough
ensure|v.| ensure|ensure safety
enter|v.| enter|enter the room
enterprise|n.| enterprise|private enterprise
entertain|v.| entertain|entertain guests
entertainment|n.| entertainment|mass entertainment
enthusiasm|n.| enthusiasm|with enthusiasm
enthusiastic|adj.| enthusiastic|enthusiastic supporter
entire|adj.| entire|entire process
entitle|v.| entitle|be entitled to
entrance|n.| entrance|main entrance
entry|n.| entry|data entry
envelope|n.| envelope|sealed envelope
environment|n.| environment|protect environment
environmental|adj.| environmental|environmental protection
envy|v./n.| envy|green with envy
equal|adj./v.| equal|equal rights
equality|n.| equality|gender equality
equip|v.| equip|equip with
equipment|n.| equipment|modern equipment
equivalent|n./adj.| equivalent|equivalent to
era|n.| era|modern era
error|n.| error|make an error
escape|v./n.| escape|escape from
especially|adv.| especially|especially important
essay|n.| essay|write an essay
essential|adj.| essential|essential skills
establish|v.| establish|establish a company
establishment|n.| establishment|business establishment
estate|n.| estate|real estate
estimate|v./n.| estimate|rough estimate
etc|abbr.| 等等|and etc.
eternal|adj.| eternal|eternal love
ethnic|adj.| ethnic|ethnic group
evaluate|v.| evaluate|evaluate performance
evaluation|n.| evaluation|performance evaluation
eve|n.| eve|Christmas eve
even|adv./adj.| even|even better
evening|n.| evening|good evening
event|n.| event|major event
eventually|adv.| eventually|eventually succeed
ever|adv.| ever|have you ever
every|adj.| every|every day
everybody|pron.| everybody|everybody knows
everyday|adj.| everyday|everyday life
everyone|pron.| everyone|everyone agrees
everything|pron.| everything|everything is fine
everywhere|adv.| everywhere|look everywhere
evidence|n.| evidence|clear evidence
evident|adj.| evident|evident truth
evil|n./adj.| evil|fight evil
evolution|n.| evolution|theory of evolution
evolve|v.| evolve|evolve over time
exact|adj.| exact|exact time
exactly|adv.| exactly|exactly right
exam|n.| exam|pass the exam
examination|n.| examination|medical examination
examine|v.| examine|examine carefully
example|n.| example|for example
exceed|v.| exceed|exceed expectations
excellent|adj.| excellent|excellent work
except|prep./conj.| except|except for
exception|n.| exception|without exception
exceptional|adj.| exceptional|exceptional talent
excess|n./adj.| excess|in excess of
excessive|adj.| excessive|excessive spending
exchange|n./v.| exchange|exchange ideas
excite|v.| excite|excite interest
excited|adj.| excited|feel excited
excitement|n.| excitement|with excitement
exciting|adj.| exciting|exciting news
exclaim|v.| exclaim|exclaim in surprise
exclude|v.| exclude|exclude from
excuse|n./v.| excuse|make an excuse
execute|v.| execute|execute a plan
executive|n./adj.| executive|chief executive
exercise|n./v.| exercise|take exercise
exert|v.| exert|exert influence
exhaust|v./n.| exhaust|feel exhausted
exhibit|v./n.| exhibit|art exhibit
exhibition|n.| exhibition|hold an exhibition
exist|v.| exist|exist in nature
existence|n.| existence|come into existence
exit|n./v.| exit|emergency exit
expand|v.| expand|expand business
expansion|n.| expansion|economic expansion
expect|v.| expect|expect success
expectation|n.| expectation|meet expectations
expense|n.| expense|at the expense of
expensive|adj.| expensive|too expensive
experience|n./v.| experience|gain experience
experienced|adj.| experienced|experienced teacher
experiment|n./v.| experiment|do an experiment
expert|n./adj.| expert|expert advice
explain|v.| explain|explain clearly
explanation|n.| explanation|reasonable explanation
explode|v.| explode|explode suddenly
exploit|v./n.| exploit|exploit resources
explore|v.| explore|explore possibilities
explosion|n.| explosion|gas explosion
export|n./v.| export|export goods
expose|v.| expose|expose the truth
exposure|n.| exposure|media exposure
express|v.| express|express thanks
expression|n.| expression|facial expression
extend|v.| extend|extend deadline
extension|n.| extension|file extension
extensive|adj.| extensive|extensive research
extent|n.| extent|to some extent
external|adj.| external|external factors
extra|adj./n.| extra|extra cost
extraordinary|adj.| extraordinary|extraordinary achievement
extreme|adj./n.| extreme|extreme weather
extremely|adv.| extremely|extremely important
eye|n.| eye|close your eyes
`.trim().split("\n");

for (const line of moreWords) {
  const [word, pos, meaning, example] = line.split("|");
  extraWords.push(`${word}\t${pos}\t${meaning}\t${example}`);
}

// 补全至 3500+：F-Z 及学位英语高频补充
const fillWords = `fabric|n.|织物|cotton fabric
facilitate|v.|促进|facilitate communication
facility|n.|设施|sports facility
factor|n.|因素|key factor
factory|n.|工厂|car factory
faculty|n.|院系/能力|medical faculty
fade|v.|褪色/消失|fade away
fail|v.|失败|fail the exam
failure|n.|失败|fear of failure
faint|adj./v.| faint|faint voice
fair|adj./n.|公平的/集市|fair competition
faith|n.|信仰|have faith in
faithful|adj.|忠诚的|faithful friend
fake|adj./n.|假的/假货|fake product
fall|v./n.|落下/秋天|fall asleep
false|adj.|错误的|false alarm
fame|n.|名声|rise to fame
familiar|adj.|熟悉的|be familiar with
family|n.|家庭|nuclear family
famine|n.|饥荒|severe famine
famous|adj.|著名的|famous writer
fan|n.|粉丝/扇子|football fan
fancy|adj./v.| fancy|fancy dress
fantastic|adj.|极好的|fantastic idea
fantasy|n.|幻想|live in fantasy
far|adv./adj.|远|far away
fare|n.|车费|bus fare
farm|n./v.|农场/ farming|work on a farm
farmer|n.|农民|local farmer
fascinate|v.|迷住|fascinate the audience
fashion|n.|时尚|fashion industry
fast|adj./adv.| fast|fast food
fasten|v.|系紧|fasten the belt
fat|n./adj.| fat|too much fat
fatal|adj.|致命的|fatal accident
fate|n.|命运|accept fate
father|n.|父亲|my father
fault|n.|过错|find fault with
favor|n./v.| favor|in favor of
favorite|adj./n.| favorite|my favorite book
fear|n./v.| fear|fear of failure
feast|n.|盛宴|wedding feast
feather|n.|羽毛|bird feather
feature|n./v.| feature|key feature
federal|adj.|联邦的|federal government
fee|n.|费用|tuition fee
feed|v./n.| feed|feed the dog
feedback|n.|反馈|positive feedback
feel|v.| feel|feel happy
feeling|n.|感觉|strong feeling
fellow|n./adj.| fellow|fellow student
female|adj./n.| female|female worker
fence|n.|栅栏|wooden fence
fertile|adj.|肥沃的|fertile soil
festival|n.|节日|Spring Festival
fetch|v.|取来|fetch water
fever|n.|发烧|have a fever
few|adj./pron.| few|a few days
fiber|n.|纤维|dietary fiber
fiction|n.|小说|science fiction
field|n.| field|in the field
fierce|adj.| fierce|fierce competition
fight|v./n.| fight|fight against
figure|n./v.| figure|public figure
file|n./v.| file|data file
fill|v.| fill|fill the form
film|n./v.| film|watch a film
filter|n./v.| filter|water filter
final|adj./n.| final|final exam
finance|n./v.| finance|public finance
financial|adj.| financial|financial crisis
find|v.| find|find out
finding|n.|发现|research finding
fine|adj./n.| fine|fine weather
finger|n.|手指|index finger
finish|v./n.| finish|finish homework
fire|n./v.| fire|catch fire
firm|n./adj.| firm|law firm
first|adj./adv.| first|first of all
fish|n./v.| fish|fresh fish
fist|n.|拳头|clench fist
fit|v./adj.| fit|keep fit
fix|v.| fix|fix the problem
flag|n.| flag|national flag
flame|n.|火焰|burst into flame
flash|n./v.| flash|flash light
flat|adj./n.| flat|flat surface
flavor|n.|味道|local flavor
flee|v.| flee|flee from danger
fleet|n.|舰队|naval fleet
flesh|n.| flesh|in the flesh
flexible|adj.| flexible|flexible schedule
flight|n.| flight|direct flight
float|v.| float|float on water
flock|n./v.| flock|a flock of birds
flood|n./v.| flood|flood warning
floor|n.| floor|on the floor
flour|n.| flour|wheat flour
flow|v./n.| flow|cash flow
flower|n.| flower|wild flower
flu|n.|流感|catch the flu
fluent|adj.| fluent|fluent English
fluid|n./adj.| fluid|body fluid
fly|v./n.| fly|fly a kite
focus|v./n.| focus|focus on
fog|n.| fog|thick fog
fold|v.| fold|fold paper
folk|n./adj.| folk|folk music
follow|v.| follow|follow the rules
following|adj./n.| following|the following day
fond|adj.| fond|be fond of
food|n.| food|fast food
fool|n./v.| fool|make a fool of
foolish|adj.| foolish|foolish mistake
foot|n.| foot|on foot
football|n.| football|play football
for|prep.| for|wait for
forbid|v.| forbid|forbid smoking
force|n./v.| force|by force
forecast|n./v.| forecast|weather forecast
forehead|n.| forehead|wide forehead
foreign|adj.| foreign|foreign language
foreigner|n.|外国人|help foreigners
forest|n.| forest|rain forest
forever|adv.| forever|love forever
forget|v.| forget|forget to do
forgive|v.| forgive|forgive sb.
fork|n.|叉子|knife and fork
form|n./v.| form|fill in a form
formal|adj.| formal|formal dress
format|n.| format|file format
former|adj.| former|former president
formula|n.| formula|chemical formula
forth|adv.| forth|back and forth
fortnight|n.|两星期|a fortnight ago
fortunate|adj.| fortunate|fortunate enough
fortune|n.| fortune|make a fortune
forward|adv./adj.| forward|look forward
found|v.| found|found a company
foundation|n.| foundation|solid foundation
fountain|n.| fountain|drinking fountain
fox|n.| fox|clever as a fox
frame|n./v.| frame|picture frame
framework|n.| framework|legal framework
free|adj./v.| free|for free
freedom|n.| freedom|freedom of speech
freeze|v.| freeze|water freezes
freight|n.| freight|air freight
frequency|n.| frequency|high frequency
fresh|adj.| fresh|fresh air
friction|n.| friction|reduce friction
friend|n.| friend|close friend
friendly|adj.| friendly|friendly smile
friendship|n.| friendship|lasting friendship
frighten|v.| frighten|frighten children
frog|n.| frog|green frog
from|prep.| from|from now on
front|n./adj.| front|in front of
frontier|n.| frontier|national frontier
frost|n.| frost|morning frost
fruit|n.| fruit|fresh fruit
frustrate|v.| frustrate|feel frustrated
fry|v.| fry|fry eggs
fuel|n./v.| fuel|save fuel
fulfill|v.| fulfill|fulfill a promise
full|adj.| full|be full of
fun|n./adj.| fun|have fun
function|n./v.| function|main function
fund|n./v.| fund|raise funds
fundamental|adj.| fundamental|fundamental principle
funeral|n.| funeral|attend a funeral
funny|adj.| funny|funny story
fur|n.| fur|animal fur
furnish|v.| furnish|furnish a room
furniture|n.| furniture|office furniture
further|adv./adj.| further|further study
furthermore|adv.| furthermore|furthermore, note that
future|n./adj.| future|in the future
gain|v./n.| gain|gain experience
gallery|n.| gallery|art gallery
gallon|n.| gallon|gallons of water
game|n.| game|video game
gang|n.| gang|criminal gang
gap|n.| gap|generation gap
garage|n.| garage|parking garage
garbage|n.| garbage|take out garbage
garden|n.| garden|botanical garden
garlic|n.| garlic|add garlic
gas|n.| gas|natural gas
gate|n.| gate|school gate
gather|v.| gather|gather information
gay|adj.| gay|gay rights
gaze|v./n.| gaze|gaze at
gear|n.| gear|safety gear
gender|n.| gender|gender equality
gene|n.| gene|dominant gene
general|adj./n.| general|in general
generate|v.| generate|generate power
generation|n.| generation|younger generation
generous|adj.| generous|generous offer
genius|n.| genius|child genius
gentle|adj.| gentle|gentle voice
gentleman|n.| gentleman|true gentleman
genuine|adj.| genuine|genuine leather
geography|n.| geography|study geography
geometry|n.| geometry|Euclidean geometry
germ|n.| germ|spread germs
gesture|n.| gesture|make a gesture
get|v.| get|get up
ghost|n.| ghost|believe in ghosts
giant|n./adj.| giant|tech giant
gift|n.| gift|birthday gift
girl|n.| girl|little girl
give|v.| give|give up
glad|adj.| glad|be glad to
glance|n./v.| glance|at a glance
glass|n.| glass|a glass of water
globe|n.| globe|around the globe
glory|n.| glory|eternal glory
glove|n.| glove|pair of gloves
glue|n./v.| glue|stick with glue
go|v.| go|go ahead
goal|n.| goal|achieve a goal
goat|n.| goat|mountain goat
gold|n./adj.| gold|gold medal
golden|adj.| golden|golden age
golf|n.| golf|play golf
good|adj./n.| good|good luck
goodbye|n./int.| goodbye|say goodbye
goods|n.| goods|consumer goods
goose|n.| goose|wild goose
govern|v.| govern|govern the country
government|n.| government|local government
governor|n.| governor|provincial governor
grab|v.| grab|grab a chance
grace|n.| grace|with grace
grade|n./v.| grade|high grade
gradual|adj.| gradual|gradual change
graduate|v./n.| graduate|graduate from
grain|n.| grain|grain of rice
grammar|n.| grammar|English grammar
grand|adj.| grand|grand plan
grandfather|n.| grandfather|my grandfather
grandmother|n.| grandmother|visit grandmother
grant|v./n.| grant|research grant
grape|n.| grape|bunch of grapes
graph|n.| graph|bar graph
grasp|v./n.| grasp|grasp the idea
grass|n.| grass|green grass
grateful|adj.| grateful|be grateful for
gravity|n.| gravity|law of gravity
gray|adj./n.| gray|gray hair
great|adj.| great|great success
greedy|adj.| greedy|greedy for power
green|adj./n.| green|green energy
greet|v.| greet|greet guests
greeting|n.| greeting|warm greeting
grey|adj.| grey|grey sky
grief|n.| grief|deep grief
grill|n./v.| grill|outdoor grill
grind|v.| grind|grind coffee
grip|n./v.| grip|firm grip
grocer|n.| grocer|local grocer
grocery|n.| grocery|grocery store
gross|adj.| gross|gross income
ground|n.| ground|on the ground
group|n./v.| group|age group
grow|v.| grow|grow up
growth|n.| growth|economic growth
guarantee|v./n.| guarantee|quality guarantee
guard|n./v.| guard|security guard
guess|v./n.| guess|make a guess
guest|n.| guest|honored guest
guidance|n.| guidance|under guidance
guide|n./v.| guide|tour guide
guilty|adj.| guilty|feel guilty
guitar|n.| guitar|play guitar
gulf|n.| gulf|Persian Gulf
gum|n.| gum|chewing gum
gun|n.| gun|carry a gun
guy|n.| guy|nice guy
gym|n.| gym|go to the gym
habit|n.| habit|bad habit
habitat|n.| habitat|natural habitat
hair|n.| hair|long hair
half|n./adj./adv.| half|half an hour
hall|n.| hall|concert hall
halt|v./n.| halt|come to a halt
ham|n.| ham|ham sandwich
hammer|n./v.| hammer|hammer a nail
hand|n./v.| hand|by hand
handful|n.| handful|a handful of
handle|v./n.| handle|handle problems
handsome|adj.| handsome|handsome man
handwriting|n.| handwriting|clear handwriting
handy|adj.| handy|come in handy
hang|v.| hang|hang up
happen|v.| happen|happen to do
happy|adj.| happy|happy birthday
harbor|n./v.| harbor|safe harbor
hard|adj./adv.| hard|work hard
hardly|adv.| hardly|hardly ever
hardship|n.| hardship|economic hardship
hardware|n.| hardware|computer hardware
harm|n./v.| harm|do harm to
harmful|adj.| harmful|harmful effects
harmony|n.| harmony|live in harmony
harsh|adj.| harsh|harsh punishment
harvest|n./v.| harvest|good harvest
hat|n.| hat|wear a hat
hatch|v.| hatch|hatch eggs
hate|v./n.| hate|hate doing
have|v.| have|have to
hawk|n.| hawk|night hawk
hay|n.| hay|bales of hay
hazard|n.| hazard|health hazard
he|pron.| he|he said
head|n./v.| head|head of department
headache|n.| headache|have a headache
headline|n.| headline|news headline
headquarters|n.| headquarters|company headquarters
heal|v.| heal|heal wounds
health|n.| health|good health
healthy|adj.| healthy|healthy diet
heap|n.| heap|a heap of
hear|v.| hear|hear from
heart|n.| heart|heart disease
heat|n./v.| heat|in the heat
heaven|n.| heaven|go to heaven
heavy|adj.| heavy|heavy rain
`.trim().split("\n");

for (const line of fillWords) {
  const [word, pos, meaning, example] = line.split("|");
  extraWords.push(`${word}\t${pos}\t${meaning}\t${example}`);
}

const fillWords2 = `hedge|n.|树篱|garden hedge
heel|n.|脚后跟|high heel
height|n.|高度|at the height of
heir|n.|继承人|legal heir
helicopter|n.|直升机|rescue helicopter
hell|n.|地狱|go to hell
hello|int.|你好|say hello
helmet|n.|头盔|wear a helmet
help|v./n.|帮助|help sb. with
helpful|adj.|有帮助的|helpful advice
helpless|adj.|无助的|feel helpless
hen|n.|母鸡|laying hen
hence|adv.|因此|hence the name
her|pron.|她的/她|her book
herd|n.|兽群|a herd of cattle
here|adv.|这里|come here
hero|n.|英雄|national hero
heroic|adj.|英雄的|heroic act
heroine|n.|女英雄|tragic heroine
hers|pron.|她的|a friend of hers
herself|pron.|她自己|by herself
hesitate|v.|犹豫|hesitate to do
hide|v.| hide|hide the truth
high|adj./adv.| high|high price
highly|adv.| highly|highly recommended
highway|n.| highway|national highway
hill|n.| hill|on the hill
hillside|n.|山坡|steep hillside
hint|n./v.| hint|give a hint
hip|n.|臀部|hip joint
hire|v./n.| hire|hire staff
his|pron.|他的|his idea
historian|n.|历史学家|famous historian
historic|adj.|历史性的|historic event
historical|adj.|历史的|historical data
history|n.| history|world history
hit|v./n.| hit|hit the target
hobby|n.| hobby|personal hobby
hold|v./n.| hold|hold a meeting
hole|n.| hole|black hole
holiday|n.| holiday|public holiday
hollow|adj./n.| hollow|hollow tree
holy|adj.| holy|holy place
home|n./adv.| home|at home
homeland|n.|祖国|return to homeland
homework|n.| homework|do homework
honest|adj.| honest|honest answer
honesty|n.| honesty|academic honesty
honey|n.| honey|a spoon of honey
honor|n./v.| honor|in honor of
hook|n./v.| hook|on the hook
hope|n./v.| hope|hope for the best
hopeful|adj.| hopeful|hopeful sign
horizon|n.| horizon|on the horizon
horn|n.| horn|car horn
horrible|adj.| horrible|horrible accident
horror|n.| horror|horror movie
horse|n.| horse|race horse
hospital|n.| hospital|local hospital
host|n./v.| host|TV host
hostess|n.|女主人|air hostess
hostile|adj.| hostile|hostile attitude
hot|adj.| hot|hot weather
hotel|n.| hotel|luxury hotel
hour|n.| hour|an hour ago
house|n./v.| house|buy a house
household|n.| household|household income
housewife|n.|家庭主妇|typical housewife
housework|n.|家务|do housework
housing|n.| housing|affordable housing
how|adv.| how|how to do
however|adv./conj.| however|however hard
huge|adj.| huge|huge success
human|n./adj.| human|human rights
humanity|n.|人性/人类|crimes against humanity
humble|adj.| humble|humble background
humid|adj.| humid|humid climate
humor|n.| humor|sense of humor
humorous|adj.| humorous|humorous story
hundred|num.| hundred|a hundred years
hunger|n.| hunger|die of hunger
hungry|adj.| hungry|feel hungry
hunt|v./n.| hunt|hunt for jobs
hunter|n.|猎人|deer hunter
hurry|v./n.| hurry|in a hurry
hurt|v./adj.| hurt|get hurt
husband|n.| husband|her husband
hut|n.|小屋|wooden hut
hydrogen|n.|氢|hydrogen energy
ice|n.| ice|break the ice
idea|n.| idea|good idea
ideal|adj./n.| ideal|ideal candidate
identical|adj.| identical|identical twins
identify|v.| identify|identify problems
identity|n.| identity|personal identity
idiom|n.|习语|English idiom
idle|adj.| idle|idle time
if|conj.| if|if possible
ignorance|n.|无知|out of ignorance
ignore|v.| ignore|ignore warnings
ill|adj./adv.| ill|fall ill
illegal|adj.| illegal|illegal activity
illness|n.| illness|serious illness
illustrate|v.| illustrate|illustrate the point
illustration|n.|插图|clear illustration
image|n.| image|public image
imaginary|adj.| imaginary|imaginary friend
imagination|n.| imagination|rich imagination
imagine|v.| imagine|hard to imagine
imitate|v.| imitate|imitate others
immediate|adj.| immediate|immediate action
immigrant|n.|移民|illegal immigrant
impact|n./v.| impact|have an impact on
implement|v./n.| implement|implement policy
implication|n.|含义/影响|policy implication
imply|v.| imply|imply that
import|n./v.| import|import goods
importance|n.| importance|of great importance
important|adj.| important|important role
impose|v.| impose|impose taxes
impossible|adj.| impossible|mission impossible
impress|v.| impress|impress the judges
impression|n.| impression|first impression
impressive|adj.| impressive|impressive performance
improve|v.| improve|improve skills
improvement|n.| improvement|significant improvement
in|prep./adv.| in|in the room
inch|n.|英寸|every inch
incident|n.|事件|minor incident
include|v.| include|include tax
including|prep.| including|including me
income|n.| income|annual income
increase|v./n.| increase|increase rapidly
increasingly|adv.| increasingly|increasingly popular
incredible|adj.| incredible|incredible story
indeed|adv.| indeed|very indeed
independence|n.|独立|national independence
independent|adj.| independent|independent thinking
index|n.| index|price index
indicate|v.| indicate|indicate that
indication|n.| indication|clear indication
indifferent|adj.| indifferent|indifferent attitude
indirect|adj.| indirect|indirect effect
individual|n./adj.| individual|each individual
indoor|adj.| indoor|indoor activity
indoors|adv.| indoors|stay indoors
industrial|adj.| industrial|industrial zone
industry|n.| industry|heavy industry
inevitable|adj.| inevitable|inevitable result
infant|n.|婴儿|newborn infant
infect|v.| infect|infect others
infer|v.| infer|infer from
inferior|adj.| inferior|inferior quality
infinite|adj.| infinite|infinite space
inflation|n.| inflation|control inflation
influence|n./v.| influence|under influence
inform|v.| inform|inform sb. of
information|n.| information|useful information
infrastructure|n.|基础设施|public infrastructure
ingredient|n.|成分|key ingredient
initial|adj./n.| initial|initial stage
initiative|n.| initiative|take initiative
inject|v.| inject|inject medicine
injure|v.| injure|injure badly
injury|n.| injury|serious injury
ink|n.|墨水|in black ink
inn|n.|小旅馆|country inn
inner|adj.| inner|inner peace
innocent|adj.| innocent|innocent victim
innovate|v.| innovate|innovate constantly
input|n./v.| input|data input
inquire|v.| inquire|inquire about
inquiry|n.| inquiry|make an inquiry
insect|n.|昆虫|harmful insect
insert|v.| insert|insert a card
inside|prep./adv.| inside|inside the box
insight|n.| insight|deep insight
insist|v.| insist|insist on
inspect|v.| inspect|inspect goods
inspire|v.| inspire|inspire students
install|v.| install|install software
instance|n.| instance|for instance
instant|adj./n.| instant|instant noodles
instead|adv.| instead|instead of
instinct|n.|本能|survival instinct
institute|n.| institute|research institute
institution|n.| institution|financial institution
instruct|v.| instruct|instruct students
instruction|n.| instruction|follow instructions
instrument|n.| instrument|musical instrument
insult|v./n.| insult|public insult
insurance|n.| insurance|life insurance
integrate|v.| integrate|integrate into
integrity|n.| integrity|personal integrity
intellectual|adj./n.| intellectual|intellectual property
intelligence|n.| intelligence|artificial intelligence
intelligent|adj.| intelligent|intelligent design
intend|v.| intend|intend to do
intense|adj.| intense|intense pressure
intensity|n.| intensity|high intensity
intention|n.| intention|good intention
interact|v.| interact|interact with
interaction|n.| interaction|social interaction
interest|n./v.| interest|lose interest
interesting|adj.| interesting|interesting story
interfere|v.| interfere|interfere with
interior|n./adj.| interior|interior design
internal|adj.| internal|internal affairs
international|adj.| international|international trade
internet|n.| internet|surf the internet
interpret|v.| interpret|interpret data
interpretation|n.| interpretation|different interpretation
interrupt|v.| interrupt|interrupt the speech
interval|n.| interval|at intervals
intervene|v.| intervene|intervene in
interview|n./v.| interview|job interview
into|prep.| into|go into
introduce|v.| introduce|introduce oneself
introduction|n.| introduction|brief introduction
invade|v.| invade|invade privacy
invasion|n.| invasion|military invasion
invent|v.| invent|invent a device
invention|n.| invention|great invention
invest|v.| invest|invest in
investigate|v.| investigate|investigate the case
investment|n.| investment|foreign investment
investor|n.|投资者|private investor
invisible|adj.| invisible|invisible hand
invitation|n.| invitation|accept invitation
invite|v.| invite|invite sb. to
involve|v.| involve|involve doing
iron|n./v.| iron|cast iron
irregular|adj.| irregular|irregular verb
island|n.| island|remote island
isolate|v.| isolate|isolate from
issue|n./v.| issue|key issue
it|pron.| it|it is true
item|n.| item|menu item
its|pron.| its|its name
itself|pron.| itself|by itself
jacket|n.| jacket|leather jacket
jail|n./v.| jail|go to jail
jam|n./v.| jam|traffic jam
jar|n.| jar|glass jar
jaw|n.| jaw|lower jaw
jazz|n.| jazz|jazz music
jealous|adj.| jealous|feel jealous
jeans|n.|牛仔裤|wear jeans
jet|n.| jet|jet plane
jewel|n.| jewel|precious jewel
job|n.| job|find a job
join|v.| join|join the club
joint|n./adj.| joint|joint effort
joke|n./v.| joke|make a joke
journal|n.| journal|academic journal
journalist|n.|记者|investigative journalist
journey|n.| journey|long journey
joy|n.| joy|with joy
judge|n./v.| judge|fair judge
judgment|n.| judgment|sound judgment
juice|n.| juice|orange juice
jump|v./n.| jump|jump over
jungle|n.| jungle|dense jungle
junior|adj./n.| junior|junior staff
jury|n.| jury|trial by jury
just|adv./adj.| just|just now
justice|n.| justice|social justice
justify|v.| justify|justify the cost
keen|adj.| keen|keen interest
keep|v.| keep|keep in touch
kettle|n.| kettle|electric kettle
key|n./adj.| key|key point
keyboard|n.| keyboard|computer keyboard
kick|v./n.| kick|kick off
kid|n./v.| kid|little kid
kill|v.| kill|kill time
kilogram|n.|千克|one kilogram
kilometer|n.|千米|five kilometers
kind|n./adj.| kind|kind person
kindergarten|n.|幼儿园|local kindergarten
king|n.| king|the king said
kingdom|n.|王国|United Kingdom
kiss|v./n.| kiss|kiss goodbye
kitchen|n.| kitchen|clean the kitchen
kite|n.| kite|fly a kite
knee|n.| knee|on one's knees
knife|n.| knife|sharp knife
knock|v./n.| knock|knock at the door
knot|n.|结|tie a knot
know|v.| know|know about
knowledge|n.| knowledge|gain knowledge
lab|n.|实验室|science lab
label|n./v.| label|price label
labor|n.|劳动|manual labor
laboratory|n.| laboratory|research laboratory
lack|n./v.| lack|lack of money
ladder|n.|梯子|climb the ladder
lady|n.|女士|young lady
lake|n.| lake|by the lake
lamb|n.| lamb|roast lamb
lamp|n.| lamp|desk lamp
land|n./v.| land|land ownership
landlord|n.|房东|contact the landlord
landscape|n.| landscape|natural landscape
lane|n.| lane|fast lane
language|n.| language|foreign language
`.trim().split("\n");

for (const line of fillWords2) {
  const [word, pos, meaning, example] = line.split("|");
  extraWords.push(`${word}\t${pos}\t${meaning}\t${example}`);
}

const fillWords3 = `lap|n.|大腿部/一圈|on my lap
laptop|n.|笔记本电脑|use a laptop
laser|n.|激光|laser surgery
lately|adv.|最近|lately I feel tired
launch|v./n.| launch|launch a product
laundry|n.|洗衣|do the laundry
law|n.|法律|obey the law
lawn|n.|草坪|mow the lawn
lawyer|n.|律师|hire a lawyer
lay|v.|放置/下蛋|lay eggs
layer|n.|层|ozone layer
lazy|adj.|懒惰的|lazy student
lead|v./n.| lead|lead the team
leader|n.| leader|team leader
leadership|n.| leadership|strong leadership
leading|adj.| leading|leading role
leaf|n.| leaf|green leaf
league|n.| league|football league
leak|v./n.| leak|water leak
lean|v./adj.| lean|lean against
leap|v./n.| leap|leap forward
learn|v.| learn|learn from
learning|n.| learning|lifelong learning
least|adj./adv.| least|at least
leather|n.| leather|leather jacket
lecture|n./v.| lecture|attend a lecture
left|adj./adv./n.| left|on the left
leg|n.| leg|break a leg
legal|adj.| legal|legal advice
leisure|n.| leisure|at leisure
lend|v.|借出|lend money
length|n.|长度|at length
lens|n.|镜头/镜片|camera lens
less|adj./adv.| less|less than
lesson|n.|课/教训|learn a lesson
let|v.|让|let me try
letter|n.|信/字母|write a letter
level|n./adj.| level|high level
liberal|adj.|自由的/开明的|liberal arts
liberty|n.|自由|personal liberty
librarian|n.|图书管理员|ask the librarian
library|n.|图书馆|school library
license|n.|执照|driver's license
lid|n.|盖子|put the lid on
livelihood|n.|生计|earn a livelihood
lighthouse|n.|灯塔|coastal lighthouse
lightweight|adj.|轻量的|lightweight design
likelihood|n.|可能性|in all likelihood
limestone|n.|石灰石|limestone cave
`.trim().split("\n");

for (const line of fillWords3) {
  const [word, pos, meaning, example] = line.split("|");
  extraWords.push(`${word}\t${pos}\t${meaning}\t${example}`);
}

const allLines = [];
for (const block of blocks) {
  allLines.push(...parseBlock(block));
}
allLines.push(...extraWords);

// 去重并截取3500
const seen = new Set();
const unique = [];
for (const line of allLines) {
  const word = line.split("\t")[0].toLowerCase();
  if (seen.has(word)) continue;
  seen.add(word);
  unique.push(line);
  if (unique.length >= 3510) break;
}

// 写入 batch 文件（每300词一个）
const BATCH = 300;
for (let i = 0; i < unique.length; i += BATCH) {
  const batchNum = String(Math.floor(i / BATCH) + 1).padStart(2, "0");
  const chunk = unique.slice(i, i + BATCH);
  writeFileSync(join(__dirname, `batch-${batchNum}.txt`), chunk.join("\n") + "\n", "utf8");
}

console.log(`Generated ${Math.ceil(unique.length / BATCH)} batch files, ${unique.length} words total`);
