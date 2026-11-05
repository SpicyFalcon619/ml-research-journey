"""
PyTorch Fundamentals: Running tensors on the GPU
"""

# =============================================================================
# WHAT YOU WILL LEARN
#   - What a GPU is and why deep learning uses one
#   - Checking whether PyTorch can see a GPU
#   - Writing "device-agnostic" code that runs on a GPU or falls back to the CPU
#   - Moving tensors to the GPU with .to() and back with .cpu()
#   - The "wrong device" error, and why NumPy forces you back to the CPU
#
# No GPU? Nothing breaks. Every line here also runs on the CPU, it just says "cpu".
# =============================================================================

import torch


### Topic 1: Why a GPU? ###
# A CPU does a few things very quickly, one after another. A GPU does THOUSANDS
# of simple things at the same time. Training a network is millions of tiny
# multiplications that do not depend on each other, which is exactly what a GPU
# is good at. That is why training runs often finish 10 to 100 times faster on one.
#
# Heads up: a laptop without an NVIDIA graphics card has no CUDA GPU. Free options
# exist (Google Colab, Kaggle notebooks) when you need one.


### Topic 2: Checking for a GPU ###
print("Is CUDA available?", torch.cuda.is_available())
print("Number of GPUs available:", torch.cuda.device_count())

# CUDA is NVIDIA's technology that lets PyTorch talk to their GPUs.


### Topic 3: Device-agnostic code ###
# Write your code so it works on ANY machine: use the GPU if there is one, and the
# CPU otherwise. Then you never edit the code when you move computers.
device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using device:", device)

# That one line (a conditional expression, see Python 4.1) is a PyTorch habit
# you will see at the top of nearly every real project.


### Topic 4: Moving tensors between devices ###
# A new tensor starts on the CPU.
tensor = torch.tensor([1, 2, 3])
print("Original tensor:", tensor)
print("Original tensor device:", tensor.device)

# .to(device) returns a copy on that device. The original stays where it was.
tensor_on_gpu = tensor.to(device)
print("Tensor on", device + ":", tensor_on_gpu)
print("Its device:", tensor_on_gpu.device)


### Topic 5: Back to the CPU ###
# NumPy lives on the CPU only. A GPU tensor cannot be turned into an array directly,
# so bring it back first with .cpu().
tensor_back_on_cpu = tensor_on_gpu.cpu()
print("Tensor back on CPU:", tensor_back_on_cpu)
print("Its device:", tensor_back_on_cpu.device)
print("Now we can use NumPy:", tensor_back_on_cpu.numpy())

# If you try tensor_on_gpu.numpy() you get an error on a GPU machine. The usual
# fix is the one-liner  tensor.cpu().numpy()  (a harmless no-op if already on the CPU).


### Topic 6: Two tensors, one device ###
# Mixing devices in one operation is the third classic error (after dtype and
# shape). Both tensors MUST live on the same device.
a = torch.tensor([1.0, 2.0]).to(device)
b = torch.tensor([3.0, 4.0]).to(device)
print("Both on the same device, so this works:", a + b)


# =============================================================================
# YOUR TURN  (write these in a scratch file, not here)
#   1. Make a random (3, 3) tensor, move it to the device, and print its device.
#   2. Move it back and turn it into a NumPy array.
#   3. If you have a GPU: put one tensor on "cuda" and leave the other on the
#      CPU, then add them. Read the error message.
#   4. Why do we check torch.cuda.is_available() instead of writing "cuda" directly?
# =============================================================================
