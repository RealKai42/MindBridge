<h1 align="center">
  Mind Bridge
</h1>
<p align="center">
  <strong>Exploring AI’s empathy and associative reasoning.</strong>
</p>

## 写在前面
这并不是一个 实战/应用 的项目，而是一个探索性的项目。我们希望通过这个项目，探索 AI 在情感和联想推理方面的能力。   

这也并不是一个严谨的科研项目，仅仅尝试去验证自己的思考和想法。

项目的核心在实验和对实验结果的解读，代码价值不高，且其中 1/3 是由 AI 生成。  

## 项目背景
相信大家或多或少了解香农的信息论，我们从广义的信息论角度来说，我们传递的信息受限于信息的载体，信息是不能凭空产生的，而是受限于载体的。  

这个描述显然是对传统计算机传递的表述，我们回想两个智能体（人）之间的沟通，这里我们假设两个智能体之间只有文字级别的沟通，不涉及 表情、语气、肢体语言等。  
我对朋友说 “美国，全称”，他会流畅的说 “美利坚合众国”，这显然是载体所没有承载的额外信息，之所有能够有传递的效果，是因为我和朋友之间有共同的知识库，这个知识库是我们在生活中积累的，是我们在生活中学习的，是我们在生活中体验的，我们可以称之为 人类的基础的知识和理解能力，亦或是叫做 **常识**。   

在前 AI 时代，我们当然可以轻易实现从 “美国，全称” 到 “美利坚合众国”的转换，例如我在两台计算机中存储了同样的 key-value 对，去映射 “美国” 到 “美利坚合众国”，但这种方法显然不是基于人类基础的知识和理解能力，而是尝试用穷举的方式去解决问题。  

在大模型时代，我们不考虑其智能底层是涌现的智能，并不是基于逻辑的智能，仅从一个高层的、抽象的角度来看，其具备了足够的智能，以及足量的 **“常识”** （事实上，他具备的常识比大多数亦或是所有人类都多）。  

那？具备足量智能和常识的大模型，能否在一定程度上像人类之间的沟通一样，在同样的上下文（常识）中，基于人类间的共识，去进行沟通。 也就是，大模型能否在交流中，产生正确的联想推理和同理心。  

## 实验方式  
我们使用一个简单且容易进行评价的任务作为此次实验的载体，这个任务是 **文本摘要**。   

### 评价方式 （Evaluation）

我们先聊评价部分，我们使用论文 [G-Eval research paper](https://arxiv.org/abs/2303.16634). 提出的评价标准，从 流畅性、连贯性、一致性、相关性 四个维度去进行评价。为了方便理解结果，我们对这四个维度求平均值，得到一个综合评价。

**评估评分标准：**
- **连贯性 - Coherence (1-5)：** 摘要如何逻辑清晰地呈现信息。
- **一致性 - Consistency (1-5)：** 摘要与来源相比的事实准确性如何。
- **流利度 - Fluency (1-3)：** 摘要的语法和结构质量。
- **相关性 - Relevance (1-5)：** 摘要从来源中捕获重要信息的程度如何。

**综合评价范围 - Average Score Range:** 1 to 4.5  

在评价时，我们会提供原始的文章和 AI 生成的摘要，以及评级标准。所以在评价时，AI 是在拥有所有需要的信息进行评价的。进行评价的 prompt 位于 [file](./src/prompt/eval.ts)。  

如果对 **AI 评价 AI** 感到奇怪或者感兴趣，可以看 [OpenAI: The New Stack and Ops for Al](https://www.youtube.com/watch?v=XGJNo8TpuVA)

### 实验内容

我们使用四种方式去获得 AI 的摘要结果，通过对比这四种方式的结果，去探索 AI 的联想推理和同理心能力。

#### Basic
基础方式，我们直接使用最直接的方式去生成摘要，为了避免 prompt 质量对结果的干扰，我们的 prompt 都写的很直接。  
对于基础的方式，我们的 [prompt](./src/prompt/prompt.ts) 是：
```
Generate a summary of the given content.

The summary should be in 200 words, PURE TEXT, DO NOT USE MARKDOWN.
The summary should be in the same language as the original input.

input: {content}
```  

这里 prompt 非常直接。  
剩下的两个要求，一个是要求输出 200 词的纯文本，这里是避免 AI 输出不同长度和不同格式的结果影响评价。  

在这个实验中，我们会输入完整的原文，所以理论上这个输出的摘要的质量是最高的，也是我们其他实验结果的基线。

#### Split Only
这里我们会对文章进行均匀采样，参数是：
```
chunkSize = 200,
chunkOverlap = 40,
sampleSize = 5,
```
对参数的理解，我们会对原始文章均匀的采样 5 块，每块长度 200 字符，块和块之间会有 40 词的重叠（overlap），防止切块对上下文的理解。  
我理解大家会好奇这个参数是怎么来的，你可以理解成就是一个 magic number 亦或是根据经验随手设定。因为针对不同的文本和来源等等特点，这三个参数的设定非常困难，我们不希望给实验引入过多的对照变量。  

我们会对切片后的结果进行摘要，这里的 [prompt](./src/prompt/prompt.ts) 是：
```
Given an evenly sampled portion of the article, generate a summary of the given content.

The summary should be in 200 words, PURE TEXT, DO NOT USE MARKDOWN.
The summary should be in the same language as the original input.

input: {content}
```  

这里我们只告诉 AI 这是从文章中均匀采样的结果，对其进行摘要。理论上，AI 只能根据摘要出来的信息进行总结，所以这种总结方式一般是较差的。  

我们认为，这是一个底线，即 AI 仅仅根据部分信息进行总结，这是一个最差的结果。  

#### Split
这里我们会使用跟 Split Only 一样的参数，所有流程都是一样的，只是修改了 [prompt](./src/prompt/prompt.ts)：
```
Given an evenly sampled portion of the article,
Based on your human knowledge and understanding, infer the full article from the sampled data and provide a summary.

The summary should be in 200 words, PURE TEXT, DO NOT USE MARKDOWN.
The summary should be in the same language as the original input.
input: {content}
```
  
这里变化就是告诉 AI，这是**均匀**采样的结果，让 AI 根据人类的基础知识和理解，去推断完整的文章并生成摘要。  

这个实验是我们核心测试的实验，我们希望 AI 能够根据人类的基础知识和理解，去推断完整的文章并生成摘要，我们希望这个输出的结果是高于纯粹的碎片输入的 Split Only 的结果。  

我们再次强调，Split 和 Split Only 的参数和输入是完全一样的，唯一的区别是 prompt 的不同。  

#### Associate
这是我们进一步的 “狂想”，我们想尝试一些更有趣的东西，这个流程中会经过如下的 pipeline：
```mermaid
graph LR;
    原始数据-->均匀采样的文本块-->D[让 AI 据此联想完整的文章]-->生成摘要;
```  

其中联想的 [prompt](./src/prompt/prompt.ts)：
```
This is an evenly sampled portion of the article. Based on this sample, imagine and infer the full article's content.
Please use your understanding to fill in the missing parts and reconstruct the complete article.

The output should be the full article that you inferred,
input: {content}
```

这个事情就变有趣了，前面的实验我们是可以大致预测输出的结果的好坏，但这个就很难预测是输出什么样的结果。  

感兴趣的朋友，可以看看 AI 输出的联想结果，还是很有意思的，看看 AI 对人类故事的理解。  

### 实验输出  
**如果对如何运行实验不感兴趣，可以直接跳转到实验分析部分。**

#### 环境设置
运行实验使用的 OpenAI GPT4o - 2024-05-13。  
我是用的是 Azure OpenAI，根目录中提供了 `.env.example` 方便大家参考，如果你使用的 OpenAI 服务，可以参考 [doc](https://js.langchain.com/docs/integrations/platforms/openai/#chat-model) 进行设置。  

注意，为了提高速度，实验中所有请求都是并发的，所以请注意你的并发限制，并注意你的 token 消耗。  

项目依赖安装：
```bash
yarn
```

#### 运行实验
运行实验的命令是 `yarn start`，这个命令会运行 `input` 文件夹中所有的 `txt` 文件，并以 `文件名 + 时间` 为文件名，将结果保存在 `output` 文件夹中。  

每个实验结果中，result.md 是方便人类阅读的实验结果，其他 `json` 是实验运行中原始数据，方便后续的分析。  


运行 `yarn sum` 会汇总 `output` 中所有的结果，输出一个 `csv` 文件到 `sumTest` 中，方便进行综合性分析。  

## 实验分析

### 测试数据
目前 main 分支，我们有 6 篇英文文章、5 篇中文文章，来源涉及 短篇小说、新闻、演讲稿。  
受限于时间、资源和精力，我们并没有寻找更多的数据，如果感兴趣可以自行查找数据，并在本地运行实验。  

### 实验结果

|testName                                                                                                 |basicAvg|splitOnlyAvg|splitAvg|associateAvg|
|---------------------------------------------------------------------------------------------------------|--------|------------|--------|------------|
|Starbucks TetleyJaguar Land Rover: Remembering Ratan Tata's global ambitions-2024-10-11-02-34-14	        |4.5     |	3.25       |	4      |	3.75       |
|Tesla unveiling its long-awaited robotaxi amid doubts about the technology it runs on-2024-10-11-02-33-16|	4      |	3          |	3.25   |	3.75       |
|The Emperor's New Clothes-2024-10-11-02-34-00                                                            |	4      |	3.75	      |4       |	4          |
|The Little Match Girl-2024-10-11-02-33-22                                                                |	4.5    |	3.5        |	4.5    |	4.5        |
|Tribute to Diana-2024-10-11-02-33-17                                                                     |	4.5    |	3.75       |	4      |	3.75       |
|Wildlife numbers fall by 73% in 50 years global stocktake finds-2024-10-11-02-33-16                      |	4.5    |	3          |	3.75   |	3.25       |
|孔乙己-2024-10-11-02-34-33                                                                                  |	4.5    |	3.75	      |4.5     |	3.5        |
|欠债400万，中国“淘金客”在非洲“翻盘”-2024-10-11-02-34-05                                                                |	4      |	3.5        |	3.25   |	3.5        |
|汪曾祺《受戒》-2024-10-11-02-34-04                                                                              |	3.75   |	2.75       |	3      |	2.5        |
|诺奖2024｜解读：miRNA与众多疾病相关，药物为何难落地？-2024-10-11-02-34-02                                                      |	4.25   |	4          |	3.75   |	4          |
|诺贝尔文学奖丨韩江：人性问题从小跟随我-2024-10-11-02-34-39                                                                  |	4.25   |	4          |	3      |	3.75       |
|Average                                                                                                  |	4.25	  |3.48        |	3.73   |	3.66       |


### 分析
从接过来看，基本验证了我们思考，对比基线的平均分 4.25，采用不同方法得到的平均分如下：
- Split Only：平均分 3.48
- Split：平均分 3.73
- Associate：平均分 3.66

可以看出，Split Only 方法的平均分最低，符合预期。这是因为模型仅根据部分信息进行摘要，缺乏对全文的全面理解。  

在 Split 方法中，我们引导模型基于人类的基础知识和理解，推断完整的文章内容，平均分有所提升。这表明，适当的提示可以激发模型的联想推理能力，使其在信息不完整的情况下生成更高质量的摘要。

Associate 方法的平均分略低于 Split，可能是因为让模型重构完整文章导致 AI 出现了偏离原文的幻想，从而导致结果偏离原始数据。然而，它仍然高于 Split Only 方法，说明模型具有一定的联想和推理能力。  

在 `sumTest` 中，我们也计算了对于 Evaluation 中不同细节维度的平均分，感兴趣的朋友可以进行进一步的分析，其中有很多有趣的点。例如对于，一致性（Consistency），Associate 方法明显低于其他方法，证明 AI 的幻想还是有点偏离现实的。  

### 思考  

就像我们最开始说的，这不是一个有实用价值的实验，只是用来验证我们的一些思考。  

- 既然 AI 跟人类有接近的常识，也就是接近的 context，那能否启发我们跟 AI 沟通的方式、prompt 的方式、利用 AI 的方式、AI 应用的方式等等。
- 既然 AI 能够联想推理，并且从结果看来，联想的方向是有一定效果的，那这又会有什么启发？
- 如果采样后的文章，在部分场景中，有跟完整文章一样的效果。那是否可以说人类的文章的创新性没我们想象的那么 “独特、高贵、独属于智慧物种”，其中的逻辑和发展，是可以被一个掌握人类所有知识的 AI 所推断的。
- 我们是否可以利用 AI 的海量知识训练和联想能力，帮助人类在信息缺失或不完整的情况下，去推测和补全缺失的信息，就像 Alpha Fold 一样，让 AI 根据自己海量知识去推测能够最优化的联系现有信息的方式，去推测缺失的信息。
- 我们能否在引导 AI 完成任务时，仅仅给出关键节点的提示，对于中间繁琐、常见和格式化的工作，让 AI 自行联想推理，去完成任务。
- 一个具有海量人类知识和一定逻辑能力的 AI，在很多任务下，并不比人类差
- .....

所以，这是一个类似思维性探索实验的项目，如果硬说有一些实用价值：
- 或许，我们证明了均匀采样后进行摘要的质量是接近使用完整内容进行摘要的，那在一些对准确度要求不高的场景，可以成倍的节约 token 消耗。
- 我们发现了一种新的 magic prompt，`Based on your human knowledge and understanding`     












