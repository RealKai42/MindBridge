import { AssociateOutput } from "./chains/associateGenSum";
import { BasicOutput } from "./chains/basicGenSum";
import { SplitOutput } from "./chains/splitGenSum";
import { splitOnlyOutput } from "./chains/splitOnlySum";

export type Output = SplitOutput | BasicOutput | AssociateOutput | splitOnlyOutput;
