import datetime
from unittest import TestCase, TestSuite, TextTestRunner


def run_test(test):
    suite = TestSuite()
    suite.addTest(test)
    TextTestRunner().run(suite)


utxos = (
    (1284101485, 9),
    (1285101485, 3),
    (1286101485, 1),
    (1287101485, 7),
    (1288101485, 1),
    (1289101485, 5),
    (1290101485, 1),
    (1291101485, 4.1),
    (1292101485, 5),
    (1293101485, 1)
)


def find_range( utxos, target):
    optimum = (0,0,utxos[0][1])
    for index, outer in enumerate(utxos):
        sum = outer[1]
        if sum>=target:
            if sum-target<optimum[2]:
                optimum = (outer[0], outer[0], sum-target)
        else:
            for inner in utxos[index+1:]:
                sum = sum + inner[1]
                if sum>=target:
                    if sum-target<optimum[2]:
                        optimum = (outer[0], inner[0], sum-target)
                break
    if optimum[0]==0:
        raise RuntimeError('Not enough satoshis')
    else:
        return (datetime.datetime.fromtimestamp(optimum[0]).strftime('%Y-%m-%d %H:%M:%S'), 
            datetime.datetime.fromtimestamp(optimum[1]).strftime('%Y-%m-%d %H:%M:%S'))



class Test_find_range(TestCase):

    def test_5(self):
        utxos = ((1284101485,9),
        (1285101485,3),
        (1286101485,1),
        (1287101485,7),
        (1288101485,1),
        (1289101485,5),
        (1290101485,1),
        (1291101485,4.1),
        (1292101485,5),
        (1293101485,1))

        self.assertEqual(('2010-11-06 20:44:45', '2010-11-06 20:44:45'),find_range(utxos,5))

    def test_not_enough(self):
        utxos = ((1284101485,9),
        (1285101485,3),
        (1286101485,1),
        (1287101485,7),
        (1288101485,1),
        (1289101485,5),
        (1290101485,1),
        (1291101485,4.1),
        (1292101485,5),
        (1293101485,1))

        with self.assertRaises(RuntimeError):
            find_range(utxos,50)


run_test(Test_find_range('test_5'))
run_test(Test_find_range('test_not_enough'))


print(find_range(utxos,5))

