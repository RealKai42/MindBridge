import { AssociateOutput } from "./chains/associateGenSum";
import { BasicOutput } from "./chains/basicGenSum";
import { SplitOutput } from "./chains/splitGenSum";

export type Output = SplitOutput | BasicOutput | AssociateOutput;
