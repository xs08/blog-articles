# Anaconda基本操做

### 创建环境

```shell
conda create -n envName ...[dependencies=version]
```

例如：

```shell
conda create -n spdata python=3.7 pyspark=2.4.4
```

### 激活环境

```shell
source activate spdata
# 或者
conda activate spdata
```

### 退出环境

```shell
source deactivate spdata
# 或者
conda deactivate spdata
```

### 删除环境

```shell
conda remove -n spdata -all
```

### 列出所有环境

```shell
conda info -e
```

