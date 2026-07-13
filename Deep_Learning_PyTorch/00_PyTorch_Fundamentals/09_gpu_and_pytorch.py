"""
PyTorch Fundamentals: Running tensors and PyTorch objects on the GPUs
"""
import torch

### Topic 1: Checking for GPU access ###
print("--- Topic 1: Checking for GPU access ---")
print(f"Is CUDA available? {torch.cuda.is_available()}")

# Count number of devices
print(f"Number of GPUs available: {torch.cuda.device_count()}\n")


### Topic 2: Setup device-agnostic code ###
print("--- Topic 2: Setup device-agnostic code ---")
# Best practice is to setup device-agnostic code 
# e.g. run on GPU if available, else default to CPU
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}\n")


### Topic 3: Moving tensors to and from the GPU ###
print("--- Topic 3: Moving tensors to and from the GPU ---")
# Create a tensor (default is CPU)
tensor = torch.tensor([1, 2, 3])
print(f"Original tensor: {tensor}")
print(f"Original tensor device: {tensor.device}\n")

# Move tensor to GPU (if available)
tensor_on_gpu = tensor.to(device)
print(f"Tensor on GPU: {tensor_on_gpu}")
print(f"Tensor on GPU device: {tensor_on_gpu.device}\n")

# Move tensor back to CPU
# Why? Because NumPy only works on the CPU! If you try tensor_on_gpu.numpy(), it will throw an error.
tensor_back_on_cpu = tensor_on_gpu.cpu()
print(f"Tensor back on CPU: {tensor_back_on_cpu}")
print(f"Tensor back on CPU device: {tensor_back_on_cpu.device}")
print(f"Now we can use NumPy: {tensor_back_on_cpu.numpy()}")
