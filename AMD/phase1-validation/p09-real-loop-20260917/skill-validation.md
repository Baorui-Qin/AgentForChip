# P09 Skill Validation

三条规则分别使用独立于正式五题的 counter 夹具。正例均包含真实模型指导派发、模型候选和四阶段 EDA PASS；反例检验诊断标签不适用时不会选中规则。该验证不证明规则带来了因果收益，也不覆盖全部语义适用范围。

| Skill | Status | Positive | Negative |
| --- | --- | --- | --- |
| rtl.syntax_structure | validated | 29cee014-7d0f-4425-ac6a-589843df6798 | af05ca66-b9c8-45a9-bb1e-a48ec2676b96 |
| rtl.sequential_specification | validated | af05ca66-b9c8-45a9-bb1e-a48ec2676b96 | 29cee014-7d0f-4425-ac6a-589843df6798 |
| rtl.conditional_dependencies | validated | 0ab3e93e-041c-4a94-a8a1-5514371d6b05 | af05ca66-b9c8-45a9-bb1e-a48ec2676b96 |
